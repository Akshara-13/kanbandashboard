import {Component} from 'react'
import Cookies from 'js-cookie'
import {useNavigate,Navigate} from 'react-router-dom'

const withRouter = (Component) => {
  return (props) => {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
};

class Login extends Component {
  state = {
    email: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeEmail = event => {
    this.setState({email: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    const {navigate}=this.props
    navigate('/',{replace:true});
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {email, password} = this.state
    const userDetails = {email, password}
    const url = 'http://localhost:5000/api/auth/login'
    const options = {
      method:'POST',
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    console.log(response)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  
 renderPasswordField = () => {
     const {password} = this.state

   return (
    <div className="flex flex-col gap-2 w-full">
      <label
        className="text-sm font-semibold tracking-wide text-gray-700"
        htmlFor="password"
      >
        PASSWORD
      </label>

      <input
        type="password"
        id="password"
        className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900 outline-none transition duration-200 placeholder:text-gray-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
        value={password}
        onChange={this.onChangePassword}
        placeholder="Enter your password"
      />
    </div>
  )
}

  renderEmailField = () => {
  const {email} = this.state

  return (
    <div className="flex flex-col gap-2 w-full">
      <label
        className="text-sm font-semibold tracking-wide text-gray-700"
        htmlFor="email"
      >
        Email
      </label>

      <input
        type="text"
        id="email"
        className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900 outline-none transition duration-200 placeholder:text-gray-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
        value={email}
        onChange={this.onChangeEmail}
        placeholder="Enter your email"
      />
    </div>
  )
}
   render() {
    const {showSubmitError, errorMsg} = this.state
    console.log(errorMsg,"hi")
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Navigate to="/" />
    }
    return (
  <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-violet-100 via-indigo-50 to-purple-100 px-4 py-10">

    <form
      className="w-full max-w-md rounded-3xl border border-white bg-white p-8 shadow-2xl shadow-violet-200/60 sm:p-10"
      onSubmit={this.submitForm}
    >

      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600 text-3xl font-bold text-white shadow-lg shadow-violet-200">
          K
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Welcome Back!
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Sign in to continue to your Kanban workspace.
        </p>
      </div>

      <div className="space-y-5">
        {this.renderEmailField()}
        {this.renderPasswordField()}
      </div>

      <button
        type="submit"
        className="mt-7 w-full rounded-xl bg-violet-600 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-200 transition duration-200 hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-violet-200 active:translate-y-0"
      >
        Login
      </button>

      {showSubmitError && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          * {errorMsg}
        </p>
      )}
    </form>
  </div>
)
  }
}

export default withRouter(Login)