import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { client } from './api/client';
import { createWhaleActivity, WhaleActivity } from "@whaletail/sdk";

interface SightingForm {
  location: {
    latitude: number;
    longitude: number;
  };
  photo: string | null; // Base64 string of the captured image TODO - make this file upload actually work
}

function ReportSighting() {
  const [form, setForm] = useState<SightingForm>({
    location: { latitude: 0, longitude: 0 },
    photo: null
  });

  const [isLocating, setIsLocating] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [totalSightings, setTotalSightings] = useState<number>(0);

  // Get location on component mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }));
          setIsLocating(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLocating(false);
        }
      );
    }
  }, []);

  useEffect(() => {
    async function fetchTotalSightings() {
      try {
        const count = await client(WhaleActivity)
          .aggregate({
            $select: { $count: "unordered" },
          });
        setTotalSightings(count.$count);
      } catch (error) {
        console.error('Error fetching total sightings:', error);
      }
    }
    fetchTotalSightings();
  }, []);

  const handleTakePhoto = async () => {
    try {
      console.log('1. Starting photo capture...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Prefer back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      console.log('2. Got media stream:', stream.getVideoTracks()[0].getSettings());
      
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      console.log('3. Created video and canvas elements');

      // Wait for video metadata to load
      await new Promise((resolve) => {
        video.addEventListener('loadedmetadata', () => {
          console.log('4. Video metadata loaded:', {
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight
          });
          video.width = video.videoWidth;
          video.height = video.videoHeight;
          resolve(true);
        });
        
        video.addEventListener('error', (e) => {
          console.error('Video error:', e);
        });
        
        video.srcObject = stream;
      });

      console.log('5. Starting video playback...');
      try {
        await video.play();
        console.log('6. Video playing:', {
          playing: !video.paused,
          width: video.width,
          height: video.height
        });
      } catch (playError) {
        console.error('Play error:', playError);
        throw playError;
      }

      // Set canvas size
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      console.log('7. Canvas dimensions set:', {
        width: canvas.width,
        height: canvas.height
      });
      
      // Get context and check it
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      console.log('8. Got canvas context');

      // Add a small delay to ensure frame is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Draw the video frame
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        console.log('9. Drew image to canvas');
        
        // Check if the canvas has data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        console.log('10. Canvas data:', {
          dataLength: imageData.data.length,
          nonZeroPixels: imageData.data.some(x => x !== 0)
        });
      } catch (drawError) {
        console.error('Draw error:', drawError);
        throw drawError;
      }

      // Convert to base64 with error checking
      let photo;
      try {
        photo = canvas.toDataURL('image/jpeg', 0.8);
        console.log('11. Converted to base64:', {
          dataLength: photo.length,
          startsWithData: photo.startsWith('data:image/jpeg;base64,')
        });
      } catch (dataUrlError) {
        console.error('toDataURL error:', dataUrlError);
        throw dataUrlError;
      }

      // Cleanup
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('12. Stopped track:', track.label);
      });
      
      // Update form
      setForm(prev => ({ ...prev, photo }));
      console.log('13. Updated form with photo');

    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    
    try {
      const result = await client(createWhaleActivity).applyAction(
        {},
          {
          $returnEdits: true,
          }
      );
      
      console.log('result: ',JSON.stringify(result))

      if (result.type === "edits") {
        
        const updatedObject = result.editedObjectTypes[0]
        console.log("Updated object", updatedObject);
        setSubmitStatus('success');
        
        // Refresh the total count
        const newCount = await client(WhaleActivity)
          .aggregate({
            $select: { $count: "unordered" },
          });
        setTotalSightings(newCount.$count);
        
        // Optional: Clear form after successful submission
        setForm({
          location: { latitude: 0, longitude: 0 },
          photo: null
        });
      } else {
        console.error('Unexpected result type:', result);
        setSubmitStatus('error');
      }

    } catch (error) {
      console.error('Error submitting sighting:', error);
      setSubmitStatus('error');
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Quick Whale Report</h1>
        
        <div className="bg-white p-4 rounded-lg shadow mb-8">
          <div className="text-center">
            <span className="text-3xl font-bold text-blue-600">
              {totalSightings === 0 ? 'Loading...' : totalSightings.toLocaleString()}
            </span>
            <p className="text-sm text-gray-600">Total Whale Sightings Reported</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">📍 Location</h2>
            {isLocating ? (
              <div className="text-gray-500">Getting your location...</div>
            ) : (
              <div className="text-sm">
                <div>Latitude: {form.location.latitude.toFixed(6)}°</div>
                <div>Longitude: {form.location.longitude.toFixed(6)}°</div>
              </div>
            )}
          </div>

          {/* Photo Capture */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">📸 Photo</h2>
            {form.photo ? (
              <div className="space-y-2">
                <img 
                  src={form.photo} 
                  alt="Captured whale" 
                  className="w-full rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, photo: null }))}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove photo
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleTakePhoto}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Take Photo
              </button>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitStatus === 'submitting' || !form.photo}
            className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${(submitStatus === 'submitting' || !form.photo)
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'}`}
          >
            {submitStatus === 'submitting' ? 'Submitting...' : 'Submit Report'}
          </button>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-sm font-medium text-green-800">
                Sighting reported successfully! 🎉
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">
                Failed to submit report. Please try again.
              </p>
            </div>
          )}
        </form>
      </div>
    </Layout>
  );
}

export default ReportSighting;
