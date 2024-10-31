import * as yup from "yup";

export const LoginSchema = yup.object().shape({
  username: yup
    .string()
    .required("User name Required")
    .matches(/^[a-zA-Z][a-zA-Z0-9._]{4,19}$/, "Must Be of Alphnumeric"),
  password: yup
    .string()
    .required("Password Required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
      "Must Be of AlpaNumeric"
    ),
});

export const SignUpSchema = yup.object().shape({
  username: yup
    .string()
    .required("User name Required")
    .matches(
      /^[a-zA-Z][a-zA-Z0-9._]{4,19}$/,
      "Must be alphanumeric and 5-20 characters long"
    ),

  name: yup
    .string()
    .required("Name Required")
    .matches(
      /^[a-zA-Z][a-zA-Z0-9._]{4,19}$/,
      "Must be alphanumeric and 5-20 characters long"
    ),

  email: yup.string().required("Email Required").email(),

  password: yup
    .string()
    .required("Password Required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
      "Password must contain uppercase, lowercase, number, and special character"
    ),
});

export const EditUserValidatorSchema = yup.object().shape({
  name: yup.string().nullable().notRequired(),
  email: yup.string().email().nullable().notRequired(),
  number: yup
    .string()
    .nullable()
    .notRequired()
    .test(
      "is-valid-number",
      "Enter a valid 10-digit number",
      (value) => !value || /^\d{10}$/.test(value)
      // Only validate if the value is not empty
    ),
  bio: yup.string().nullable().notRequired(),
});
