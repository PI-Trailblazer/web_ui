import { useLocation } from 'react-router-dom'

export default function useCheckActiveNav() {
  const { pathname } = useLocation()

  const checkActiveNav = (nav: string) => {
    const pathArray = pathname.split('/').filter((item) => item !== '')
    const navArray = nav.split('/').filter((item) => item !== '')

    // Verifica se o caminho atual corresponde exatamente ao nav fornecido
    return pathArray.join('/') === navArray.join('/')
  }

  return { checkActiveNav }
}