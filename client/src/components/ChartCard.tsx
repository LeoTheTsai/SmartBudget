import { Paper, Typography, Box } from '@mui/material'

interface ChartCardProps {
  title: string
  children: React.ReactNode
  height?: number | string
}

const ChartCard = ({ title, children, height = 350 }: ChartCardProps) => (
  <Paper
    elevation={3}
    sx={{
      p: 2,
      pb: 4, // add bottom padding
      borderRadius: 3,
      height,
      display: 'flex',
      flexDirection: 'column'
    }}
  >
    <Typography variant="subtitle1" mb={2}>{title}</Typography>
    <Box sx={{ flexGrow: 1, minHeight: 0 }}>{children}</Box>
  </Paper>
)

export default ChartCard
