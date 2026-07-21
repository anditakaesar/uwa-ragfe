import { format } from "date-fns"
import './Footer.css'

const Footer = () => {
  const today = new Date()
  return (
    <div className="footer-sticky">
      Uwa Go Rag &copy; {format(today, "yyyy")}
    </div>
  )
}

export default Footer
