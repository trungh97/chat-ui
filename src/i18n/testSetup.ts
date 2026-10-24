import i18n from './i18n'

// Tests assert English text regardless of the machine's browser language
beforeEach(async () => {
  await i18n.changeLanguage('en')
  window.localStorage.clear()
})
