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
  avatar: yup
    .mixed()
    .required("Avatar Required")
    .test("fileSize", "The file is too large", (value) => {
      return value && value[0] && value[0].size <= 2000000; // 2MB max size
    })
    .test("fileType", "Unsupported file format", (value) => {
      // console.log( value );
      return (
        value &&
        value[0] &&
        ["image/jpeg", "image/png", "image/gif"].includes(value[0].type)
      );
    }),

  username: yup
    .string()
    .required("User name Required")
    .matches(/^[a-zA-Z][a-zA-Z0-9._]{4,19}$/, "Must Be of Alphanumeric"),
  name: yup
    .string()
    .required("User name Required")
    .matches(/^[a-zA-Z][a-zA-Z0-9._]{4,19}$/, "Must Be of Alphanumeric"),

  email: yup.string().required("Email Required").email(),

  password: yup
    .string()
    .required("Password Required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
      "Must Be Alphanumeric"
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
