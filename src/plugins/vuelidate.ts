// แค่ re-export ให้ import จาก '@/plugins/vuelidate' ได้สะดวก
export { default as useVuelidate } from '@vuelidate/core'
export {
  required,
  minLength,
  maxLength,
  email,
  numeric,
  requiredIf,
  requiredUnless,
  helpers,
} from '@vuelidate/validators'
