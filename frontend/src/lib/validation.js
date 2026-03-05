/**
 * Валидация email и пароля для форм входа и регистрации
 * Содержит regex паттерны и функции проверки
 */

// Регулярные выражения
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

/**
 * Проверка валидности email
 * @param {string} email - Email для проверки
 * @returns {boolean} - true если email валиден
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false
  return emailRegex.test(email.trim())
}

/**
 * Проверка валидности пароля
 * @param {string} password - Пароль для проверки  
 * @returns {boolean} - true если пароль валиден
 */
export const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false
  return passwordRegex.test(password)
}

/**
 * Получение сообщения об ошибке для email
 * @param {string} email - Email для проверки
 * @returns {string} - Сообщение об ошибке или пустая строка
 */
export const getEmailError = (email) => {
  if (!email) return ''
  if (!isValidEmail(email)) {
    return 'Введіть дійсну адресу електронної пошти'
  }
  return ''
}

/**
 * Получение сообщения об ошибке для пароля
 * @param {string} password - Пароль для проверки
 * @returns {string} - Сообщение об ошибке или пустая строка
 */
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
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return 'Пароль повинен містити спеціальний символ (@$!%*?&)'
  }
  return ''
}

/**
 * Проверка готовности формы для отправки
 * @param {string} email - Email
 * @param {string} password - Пароль
 * @param {string} name - Имя (опционально, для регистрации)
 * @returns {boolean} - true если форма готова к отправке
 */
export const isFormValid = (email, password, name = null) => {
  const emailValid = isValidEmail(email)
  const passwordValid = isValidPassword(password)
  const nameValid = name === null || (name && name.trim().length >= 2)
  
  return emailValid && passwordValid && nameValid
}