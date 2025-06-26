import React from "react";
import { Box, Stack, Typography, Button, LinearProgress } from "@mui/material";

/**
 * Calculate the overall weighted progress across all workers
 * Each worker's progress is weighted by its workload (image count)
 */
export type WorkerStatus = {
  id: number;
  imageCount: number;
  progress: number;
  completed: boolean;
  active: boolean;
};

export const calculateOverallProgress = (statuses: WorkerStatus[]) => {
  if (statuses.length === 0) return 0;
  
  const totalImages = statuses.reduce((sum, status) => sum + status.imageCount, 0);
  if (totalImages === 0) return 0;
  
  const weightedProgress = statuses.reduce((sum, status) => {
    // Weight each worker's progress by its proportion of the total workload
    const weight = status.imageCount / totalImages;
    return sum + (status.progress * weight);
  }, 0);
  
  return Math.round(weightedProgress);
};

interface WorkerProgressDisplayProps {
  workerStatuses: WorkerStatus[];
  activeWorkers: number;
  isExporting: boolean;
  exportFinished: boolean;
  setShowWorkerStatus: (value: boolean) => void;
}

function WorkerProgressDisplay({
  workerStatuses,
  activeWorkers,
  isExporting,
  exportFinished,
  setShowWorkerStatus,
}: WorkerProgressDisplayProps) {
  // Calculate overall progress across all workers
  const overallProgress = calculateOverallProgress(workerStatuses);
  
  return (
    <Box sx={{ mt: 2, width: '100%', maxWidth: '600px' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle2">
          {activeWorkers > 0 
            ? `Worker Status: ${activeWorkers} active workers` 
            : isExporting 
              ? "Initializing workers..."
              : "Export complete"}
        </Typography>
        {exportFinished && (
          <Button 
            size="small" 
            onClick={() => setShowWorkerStatus(false)} 
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          >
            Hide Details
          </Button>
        )}
      </Stack>
      
      {/* Display overall progress */}
      {workerStatuses.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption">Overall Progress</Typography>
            <Typography variant="caption">{overallProgress}%</Typography>
          </Stack>
          <LinearProgress 
            variant="determinate" 
            value={overallProgress} 
            sx={{ 
              height: 8,
              borderRadius: 3,
              backgroundColor: 'grey.300',
              '& .MuiLinearProgress-bar': {
                backgroundColor: overallProgress === 100 ? 'success.main' : 'primary.main'
              }
            }} 
          />
        </Box>
      )}
      
      {workerStatuses.length === 0 ? (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          {isExporting ? (
            <LinearProgress variant="indeterminate" />
          ) : (
            <Typography variant="body2">No active workers</Typography>
          )}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
          {workerStatuses.map((worker) => (
            <Box 
              key={worker.id}
              sx={{
                border: '1px solid',
                borderColor: worker.completed ? 'success.main' : worker.active ? 'primary.main' : 'error.main',
                borderRadius: 1,
                p: 1,
                minWidth: '100px',
                position: 'relative',
                backgroundColor: 'background.paper'
              }}
            >
              <Typography variant="caption" display="block">
                Worker {worker.id + 1}
              </Typography>
              <Typography variant="caption" display="block">
                {worker.imageCount} images
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={worker.progress} 
                sx={{ 
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'grey.300',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: worker.completed ? 'success.main' : 'primary.main'
                  }
                }} 
              />
              <Typography variant="caption" display="block" align="right">
                {worker.progress}%
              </Typography>
              <Typography variant="caption" display="block">
                Status: {worker.completed ? "Complete" : worker.active ? "Active" : "Error"}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default WorkerProgressDisplay;
