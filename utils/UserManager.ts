import { setCookie, destroyCookie, parseCookies } from 'nookies'


//cookie functions
export function setCookieValue(cName: string, cValue: string, expDays = 30) {
  const maxAge = expDays ? expDays * 24 * 60 * 60 * 1000 : null
  const domain = process.env.NEXT_PUBLIC_CROSS_DOMAIN

  if (domain && domain !== '.localhost')
    setCookie(null, `${cName}`, cValue, { maxAge, domain, path: '/' })
  else setCookie(null, `${cName}`, cValue, { maxAge, path: '/' })
}

export function setLoggedInUser(user: any) {
  if (getCookie('token')) setCookieValue('user', user, 30)
}

export function removeLoggedInUser() {
  removeCookie('token')
  localStorage.clear()
}

export function getToken() {
  return getCookie('token')
}

export function getCookie(cName: string, ctx?: any) {
  const cookies = parseCookies(ctx)
  return cookies[`${cName}`] ? cookies[`${cName}`] : null
}

export function removeCookie(cName: string) {
  const maxAge = 30 * 24 * 60 * 60 * 1000
  const domain = process.env.NEXT_PUBLIC_CROSS_DOMAIN

  if (domain && domain !== '.localhost')
    destroyCookie(null, `${cName}`, { domain, path: '/' })
  else destroyCookie(null, `${cName}`, { path: '/', maxAge })

}
