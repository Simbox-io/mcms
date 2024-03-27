'use client'
const StopImpersonationButton = () => {

    const handleEndImpersonation = async () => {
        try {
          const response = await fetch('/api/end-impersonation', {
            method: 'POST',
          });
          if (response.ok) {
            // Refresh the page to apply the original session
            window.location.reload();
          } else {
            console.error('Error ending impersonation:', response.statusText);
          }
        } catch (error) {
          console.error('Error ending impersonation:', error);
        }
      };

    return (
        <button onClick={handleEndImpersonation} className="bg-white text-black rounded px-2 py-0">End session</button>
    )
}

export default StopImpersonationButton;