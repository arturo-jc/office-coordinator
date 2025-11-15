import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import NewInviteForm from './NewInviteForm'

export default async function NewInvitePage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8 text-black dark:text-zinc-50">
          New Invite
        </h1>
        <NewInviteForm />
      </div>
    </div>
  )
}
