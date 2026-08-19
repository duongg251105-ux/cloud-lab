import { useEffect, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {
  const [students, setStudents] = useState([])
  const [form, setForm] = useState({ studentId: '', name: '', email: '' })
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [isLoading, setIsLoading] = useState(true)

  const loadStudents = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/students`)
      if (!response.ok) throw new Error('Không thể tải danh sách sinh viên')
      setStudents(await response.json())
      setStatus({ type: 'idle', message: '' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadStudents() }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: 'loading', message: 'Đang lưu sinh viên...' })
    try {
      const response = await fetch(`${API_URL}/api/students${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Không thể lưu sinh viên')
      setStudents((current) => editingId ? current.map((student) => student._id === editingId ? result : student) : [...current, result])
      setForm({ studentId: '', name: '', email: '' })
      setEditingId(null)
      setStatus({ type: 'success', message: editingId ? 'Đã cập nhật sinh viên' : 'Đã thêm sinh viên thành công' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  const handleEdit = (student) => {
    setEditingId(student._id)
    setForm({ studentId: student.studentId, name: student.name, email: student.email })
    setStatus({ type: 'idle', message: '' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sinh viên này?')) return
    try {
      const response = await fetch(`${API_URL}/api/students/${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Không thể xóa sinh viên')
      setStudents((current) => current.filter((student) => student._id !== id))
      setStatus({ type: 'success', message: 'Đã xóa sinh viên' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark">CL</div>
        <div><p className="eyebrow">CLOUD LAB / REST API</p><h1>Quản lý sinh viên</h1></div>
        <div className="connection-pill"><span /> MongoDB Atlas</div>
      </header>
      <section className="intro">
        <div><p className="eyebrow">DANH SÁCH ĐANG LƯU</p><h2>Student registry</h2><p className="intro-copy">Theo dõi hồ sơ sinh viên từ backend Node.js và MongoDB.</p></div>
        <div className="count-block"><strong>{students.length.toString().padStart(2, '0')}</strong><span>hồ sơ</span></div>
      </section>
      <section className="workspace">
        <div className="list-panel">
          <div className="panel-heading"><div><p className="eyebrow">CÂU 47</p><h3>Danh sách sinh viên</h3></div><button className="icon-button" type="button" onClick={loadStudents} title="Tải lại danh sách" aria-label="Tải lại danh sách">↻</button></div>
          {isLoading ? <p className="empty-state">Đang tải dữ liệu...</p> : students.length === 0 ? <p className="empty-state">Chưa có sinh viên nào.</p> : <div className="student-list">{students.map((student, index) => <article className="student-row" key={student._id}><div className="student-index">{String(index + 1).padStart(2, '0')}</div><div className="student-info"><strong>{student.name}</strong><span>{student.email}</span></div><code>{student.studentId}</code><div className="row-actions"><button type="button" onClick={() => handleEdit(student)} title="Sửa sinh viên">Sửa</button><button type="button" onClick={() => handleDelete(student._id)} title="Xóa sinh viên">Xóa</button></div></article>)}</div>}
        </div>
        <form className="form-panel" onSubmit={handleSubmit}>
          <p className="eyebrow">CÂU 48 / 49 / 61 / 62</p><h3>{editingId ? 'Cập nhật hồ sơ' : 'Thêm hồ sơ mới'}</h3><p className="form-copy">Nhập đủ thông tin để gửi request {editingId ? 'PUT' : 'POST'} đến API.</p>
          <label>MSSV<input name="studentId" value={form.studentId} onChange={handleChange} placeholder="SV002" required /></label>
          <label>Họ tên<input name="name" value={form.name} onChange={handleChange} placeholder="Nguyễn Văn B" required /></label>
          <label>Email<input name="email" type="email" value={form.email} onChange={handleChange} placeholder="student@example.com" required /></label>
          <button className="submit-button" type="submit" disabled={status.type === 'loading'}>{status.type === 'loading' ? 'Đang lưu...' : editingId ? 'Lưu thay đổi' : 'Thêm sinh viên'} <span>→</span></button>
          {editingId && <button className="cancel-button" type="button" onClick={() => { setEditingId(null); setForm({ studentId: '', name: '', email: '' }) }}>Hủy chỉnh sửa</button>}
          {status.message && <p className={`status-message ${status.type}`}>{status.message}</p>}
        </form>
      </section>
      <footer><span>BACKEND ONLINE</span><span>PORT 5000 · REACT + VITE</span></footer>
    </main>
  )
}

export default App
