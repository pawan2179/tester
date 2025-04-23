import { CallControls, CallingState, CallParticipantListing, CallParticipantsList, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk';
import { LayoutListIcon, LoaderIcon, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useToaster } from 'react-hot-toast';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import EndCallButton from './EndCallButton';
import CodeEditor from './CodeEditor';

const MeetingRoom = () => {
  const [layout, setLayout] = useState<"grid" | "speaker">("speaker");
  const [showParticipants, setShowParticipants] = useState(false);
  const router = useRouter();
  const {useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if(callingState !== CallingState.JOINED) {
    return (
      <div className='h-96 flex items-center justify-center'>
        <LoaderIcon className='size-6 animate-spin' />
      </div>
    )
  }

  return (
    <div className='h-[calc(100vh-4rem-1px)]'>
      <ResizablePanelGroup direction='horizontal'>
      {/* LEFT PANEL */}

      <ResizablePanel defaultSize={35} minSize={25} maxSize={100} className='relative'>
        {/* VIDEO LAYOUT */}
        <div className='absolute inset-0'>
          {layout === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}

          {/* PARTICIPANTS */}
          {showParticipants && (
            <div className='absolute right-0 top-0 h-full w-[300px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
              <CallParticipantsList onClose={() => setShowParticipants(false)} />
            </div>
          )}
        </div>
        {/* VIDEO CONTROL */}
        <div className='absolute bottom-4 left-0 right-0'>
          <div className='flex flex-col items-center gap-4'>
            <div className='flex items-center gap-2 flex-wrap justify-center px-4'>
              <CallControls onLeave={() => router.push("/")} />
                <div className='flex items-center gap-2'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={'outline'} size={"icon"} className='size-10'>
                        <LayoutListIcon className='size-4'/>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setLayout("grid")}>Grid View</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLayout("speaker")}>Speaker View</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant={'outline'}
                    size={'icon'}
                    className='size-10'
                    onClick={() => setShowParticipants(prev => !prev)}
                  >
                    <UserIcon className='size-4' />
                  </Button>
                  <EndCallButton />
                </div>
            </div>
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />
      {/* RIGHT PANEL */}
      <ResizablePanel defaultSize={65} minSize={25}>
        {/* <div className='text-white'>abcdef</div> */}
        <CodeEditor />
      </ResizablePanel>
    </ResizablePanelGroup>
    </div>
  )
}

export default MeetingRoom