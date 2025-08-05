import { Alert, Snackbar, Slide } from '@mui/material'
import { SlideProps } from '@mui/material/Slide'

interface AlertBannerProps {
  message: string
  severity?: 'info' | 'warning' | 'error' | 'success'
  open: boolean
  onClose: () => void
}

const SlideTransition = (props: SlideProps) => {
  return <Slide {...props} direction="left" /> // Slide in from right side
}

const AlertBanner = ({
  message,
  severity = 'info',
  open,
  onClose
}: AlertBannerProps) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      TransitionComponent={SlideTransition}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

export default AlertBanner
