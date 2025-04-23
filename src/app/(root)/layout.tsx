import StreamClientProvider from '@/components/providers/StreamClientProvider'
import React, { ReactNode } from 'react'

const layout = ({children}: {children: ReactNode}) => {
  return (
    <StreamClientProvider>{children}</StreamClientProvider>
  )
}

export default layout