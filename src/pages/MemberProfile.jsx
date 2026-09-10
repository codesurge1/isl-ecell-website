import { useParams } from 'react-router-dom'

function MemberProfile() {
  const { memberId } = useParams()

  return (
    <main className="p-8">
      <h1 className="text-3xl">Member Profile</h1>
      <p>Member ID: {memberId}</p>
    </main>
  )
}

export default MemberProfile
