import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { initGoogle } from '../helpers/googleAuth'
import { register, login, loginGoogle } from '../features/authSlice'
import { fetchFavorites } from '../features/favoritesSlice'

export default function AuthForm(){
  const dispatch = useDispatch()
  const { status } = useSelector(s => s.auth)
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name:'', email:'', password:'' })

  useEffect(()=>{
    initGoogle(async (idToken)=> {
      try {
        await dispatch(loginGoogle(idToken)).unwrap()
        dispatch(fetchFavorites())
        await Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'Welcome back!',
          timer: 1500,
          showConfirmButton: false
        })
        window.location.hash = '#/'
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Google Login Failed',
          text: err || 'An error occurred during Google login',
        })
      }
    })
  },[dispatch])

  const submit = async (e)=>{
    e.preventDefault()
    try {
      if (mode==='register') {
        await dispatch(register(form)).unwrap()
        await Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Please login with your new account',
          confirmButtonText: 'OK'
        })
        setMode('login')
        setForm({ name:'', email:'', password:'' })
      } else {
        await dispatch(login({ email:form.email, password:form.password })).unwrap()
        dispatch(fetchFavorites())
        await Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'Welcome back!',
          timer: 1500,
          showConfirmButton: false
        })
        window.location.hash = '#/'
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: mode === 'login' ? 'Login Failed' : 'Registration Failed',
        text: err.message || 'An error occurred',
      })
    }
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">{mode==='login'?'Login':'Register'}</h5>
          <button className="btn btn-link" onClick={()=>{
            setMode(mode==='login'?'register':'login')
          }}>
            {mode==='login'?'Create account':'I already have account'}
          </button>
        </div>

        <form onSubmit={submit} className="row g-3">
          {mode==='register' && (
            <div className="col-12">
              <label className="form-label">Name</label>
              <input required className="form-control" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
            </div>
          )}
          <div className="col-12">
            <label className="form-label">Email</label>
            <input required type="email" className="form-control" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
          </div>
          <div className="col-12">
            <label className="form-label">Password</label>
            <input required type="password" className="form-control" value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
          </div>
          <div className="col-12 d-grid">
            <button className="btn btn-primary" type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {mode==='login'?'Logging in...':'Registering...'}
                </>
              ) : (
                mode==='login'?'Login':'Register'
              )}
            </button>
          </div>
        </form>

        <div className="text-center my-3 text-muted">or</div>
        <div id="googleSignInDiv" className="d-flex justify-content-center"></div>
      </div>
    </div>
  )
}
