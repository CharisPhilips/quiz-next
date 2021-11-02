import * as Yup from 'yup';
export const validateEmail = (email) => {
  if (!email) return 'Please input email';

  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const validate = re.test(String(email).toLowerCase());
  if (validate) return '';
  else return 'Please input valid email';
};

export const validatePassword = (password) => {
  if (!password) return 'Please input password';
  if (password.length < 6) {
    return 'Your password must be at least 6 characters';
  }
  if (password.search(/[a-z]/i) < 0) {
    return 'Your password must contain at least one letter.';
  }
  if (password.search(/[0-9]/) < 0) {
    return 'Your password must contain at least one digit.';
  }
  return '';
};

export const registerSchema = Yup.object().shape({
  nickname: Yup.string().required('Please enter nickname'),
  email: Yup.string()
    .email('Please input valid email')
    .required('Please enter email'),
  password: Yup.string()
    .min(6, 'Too Short!')
    .max(50, 'Too Long!')
    .matches(
      /^(?=.*[0-9])(?=.*[a-zA-Z])(?=\S+$).{6,50}$/,
      'Must containe one letter and one digit'
    )
    .required('Please enter password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please enter confirm password'),
});
