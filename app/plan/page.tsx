import { PlannerWorkspace } from '@/components/chat/planner-workspace'
import { getAuthUser } from '@/lib/supabase/auth'

export default async function PlanPage() {
  const user = await getAuthUser()

  return <PlannerWorkspace signedIn={Boolean(user)} />
}
