// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'

/**
 *  Set Home URL based on User Roles
 */
// export const getHomeRoute = () => {
//   // if (role === 'client') return '/acl'
//   // else return '/dashboards/crm'
//   return '/dashboards/crm'
// }

// 홈 화면 실행
const Home = () => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    // 사용자 정보가 있을 경우, 페이지 이동 처리
    if (auth.user) {
      router.replace('/dashboards/crm')
      console.log('auth.user 정보', auth.user)
    }
  }, [])

  return <Spinner />
}

export default Home
