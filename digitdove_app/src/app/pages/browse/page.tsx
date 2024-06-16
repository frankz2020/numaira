"use client"
import { useGlobalContext } from '@/app/providers/GlobalContext'
import React from 'react'

const Browse = () => {
    const {user} = useGlobalContext()
  return (
    <div>page</div>
  )
}

export default Browse