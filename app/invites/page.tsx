import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function InvitesPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8 text-black dark:text-zinc-50">
          Invites
        </h1>

        <div className="flex flex-col items-start gap-6">
          <Link href="/invites/new" className="flex items-center justify-center gap-3 w-64 h-64 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm hover:shadow-md">
            <Plus className="w-8 h-8 text-zinc-600 dark:text-zinc-400" />
            <span className="text-xl font-medium text-zinc-800 dark:text-zinc-200">
              Create Invite
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
