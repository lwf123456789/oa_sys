import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Spin } from 'antd'
import { useEffect } from 'react'

export function withoutAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithoutAuth(props: P) {
    const { status, data: session } = useSession()
    const router = useRouter()

    useEffect(() => {
      if (status === "authenticated" && window.location.pathname === '/') {
        router.replace("/system/user")
      }
    }, [status, router])

    // if (status === "loading" && !session) {
    //   return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>
    // }

    return <WrappedComponent {...props} />
  }
}