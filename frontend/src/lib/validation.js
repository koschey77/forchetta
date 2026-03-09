// Валидация email и пароля для форм входа и регистрации

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false
  return emailRegex.test(email.trim())
}

export const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false
  return passwordRegex.test(password)
}

export const getEmailError = (email) => {
  if (!email) return ''
  if (!isValidEmail(email)) {
    return 'Введіть дійсну адресу електронної пошти'
  }
  return ''
}

export const getPasswordError = (password) => {
  if (!password) return ''
  if (password.length < 8) {
    return 'Пароль повинен містити мінімум 8 символів'
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Пароль повинен містити малу літеру'
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Пароль повинен містити велику літеру'
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'Пароль повинен містити цифру'
  }
  return ''
}

export const isFormValid = (email, password, name = null) => {
  const emailValid = isValidEmail(email)
  const passwordValid = isValidPassword(password)
  const nameValid = name === null || (name && name.trim().length >= 2)
  
  return emailValid && passwordValid && nameValid
}