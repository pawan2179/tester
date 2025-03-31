import { httpRouter } from "convex/server";
import { httpAction} from "./_generated/server"
import { WebhookEvent} from "@clerk/nextjs/server";
import { Webhook } from "svix";
import {api} from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async(ctx, request) => {
    // console.log("in http handler");
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    // console.log("webhook secret fetched : ", webhookSecret);
    if(!webhookSecret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable")
    }

    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    // console.log("svix id fetched : ", svix_id );
    // console.log("svix signature fetched : ", svix_signature );
    // console.log("svix timestamp fetched : ", svix_timestamp );

    if(!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("No svix headers found", {
        status: 400
      });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    // console.log("request payload : ", payload);

    let wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature
      }) as WebhookEvent;
    } catch(error) {
      console.error("Error while verifying webhook ", error);
      return new Response("Error occured", {status:400});
    }
    // console.log("webhook event : ", evt);
    const eventType = evt.type;

    if(eventType === "user.created") {
      const {id, email_addresses, first_name, last_name, image_url} = evt.data;
      const email = email_addresses[0].email_address;
      const name = `${first_name || " "} ${last_name || " "}`.trim();

      try {
        // console.log("Calling sync user");
        await ctx.runMutation(api.users.syncUser, {
          clerkId: id,
          email,
          name,
          image: image_url
        })
      } catch (error) {
        console.error("Error creating user: ", error);
        return new Response("Error creating user", {status: 500});
      }
    }
    return new Response("Webhook processed successfully", {status: 200});
  })
})

export default http;