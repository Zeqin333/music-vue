export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }

  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function getDate(el, name, val) {
  let prefix = 'data-'
  if (val) {
    return el.setAttribute(prefix + name, val)
  } else {
    return el.getAttribute(prefix + name)
  }
}

export function filter(value) {
  if (!value) {
    return ''
  }
  if (parseInt(value) >= 10000) {
    // eslint-disable-next-line
    return Math.ceil(value / 10000 * 10 ) / 10 + '万'
  } else {
    return value
  }
}
