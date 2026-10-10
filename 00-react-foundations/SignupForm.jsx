// import { useState } from 'react';

// function SignupForm({ onSubmit }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errors, setErrors] = useState([]);

//   function validate() {
//     const newErrors = [];
//     if (!email.includes('@')) newErrors.push('Email must be valid.');
//     if (password.length < 8) newErrors.push('Password must be at least 8 characters.');
//     return newErrors;
//   }

//   function handleSubmit(event) {
//     event.preventDefault(); // stop the browser's default full-page-reload form submission
//     const validationErrors = validate();
//     if (validationErrors.length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
//     setErrors([]);
//     onSubmit({ email, password });
//   }

//   return (
//     <form onSubmit={handleSubmit} noValidate>
//       <label htmlFor="email">Email</label>
//       <input
//         id="email"
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <label htmlFor="password">Password</label>
//       <input
//         id="password"
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       {errors.length > 0 && (
//         <ul data-testid="error-list">
//           {errors.map((error) => (
//             <li key={error}>{error}</li>
//           ))}
//         </ul>
//       )}

//       <button type="submit">Sign up</button>
//     </form>
//   );
// }

// export default SignupForm;
































import {useState} from "react"

function SignUpForm({onSubmit}){
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [errors, setErrors] = useState([])

function validate(){
  const newErrors = []
  if(!email.includes(@)) newErrors('the email is not written well')
  if(password.length < 8) newErrors('password is not long enough')
  return newErrors
}

function handleSubmit(e){
  e.preventDefault()
  const validationErrors = validate();
  if (validationErrors.length > 0){
    setErrors(validationErrors)
    return
  }
  setError()
}

return (
  <form onSubmit={handleSubmit}>
    <label htmlFor="email">Email</label>
    <input type="email" id={email} value={email} onChange={(e)=> setEmail(e.target.value)} />
    <label htmlFor="password">Password</label>
    <input type="password" id={password} value={password} onChange={(e)=> setPassword(e.target.value)} />

    {errors.length && (
      <ul data-testid="error-length">
        {errors.map(error)=>(
          <li id={error}> {error} </li>
        )}
      </ul>
    )}
  </form>
)
}
export default SignUpForm;
