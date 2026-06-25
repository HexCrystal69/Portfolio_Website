"use client"

import dynamic from 'next/dynamic'

const Exploration = dynamic(
  () => import('@/components/exploration').then((mod) => mod.Exploration),
  { ssr: false }
)

export default function Page() {
  return <Exploration />
}
