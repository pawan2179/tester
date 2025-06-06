import { LoaderIcon } from 'lucide-react'
import React from 'react'

const LoaderUI = () => {
  return (
    <div className='h-[calc(100vh-4rem-1px)] flex items-center justify-center'>
      <LoaderIcon className='w-8 h-8 animate-spin text-muted-foreground' />
    </div>
  )
}

export default LoaderUI