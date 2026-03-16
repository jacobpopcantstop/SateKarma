import Button from '../ui/Button'

export default function TimerControls({ status, onStart, onPause, onResume, onStop }) {
  return (
    <div className="flex items-center gap-4 mt-8">
      {status === 'idle' && (
        <Button variant="primary" size="xl" onClick={onStart}>
          Begin
        </Button>
      )}
      {status === 'running' && (
        <>
          <Button variant="secondary" size="lg" onClick={onPause}>
            Pause
          </Button>
          <Button variant="ghost" size="md" onClick={onStop}>
            End early
          </Button>
        </>
      )}
      {status === 'paused' && (
        <>
          <Button variant="primary" size="lg" onClick={onResume}>
            Resume
          </Button>
          <Button variant="ghost" size="md" onClick={onStop}>
            End
          </Button>
        </>
      )}
    </div>
  )
}
