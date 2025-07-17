import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Bell, X, Calendar, Clock, Briefcase } from 'lucide-react';

const NotificationHandler = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    const checkNotifications = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/notifications/${encodeURIComponent(user.primaryEmailAddress.emailAddress)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setNotifications(data);
            setShowNotifications(true);
            
            // Show browser notification
            if (Notification.permission === 'granted') {
              data.forEach(notification => {
                new Notification('Interview Reminder', {
                  body: `Your interview with ${notification.interview.company} for ${notification.interview.jobRole} is starting in 2 minutes!`,
                  icon: '/favicon.ico'
                });
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Check for notifications every 10 seconds
    const interval = setInterval(checkNotifications, 10000);
    checkNotifications(); // Check immediately

    return () => clearInterval(interval);
  }, [user?.primaryEmailAddress?.emailAddress]);

  const handleNotificationClick = async (notification) => {
    try {
      // Clear notification from server
      await fetch(`http://localhost:5000/api/notifications/${notification.id}`, {
        method: 'DELETE'
      });
      
      // Remove from local state
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
      
      // Navigate to job link
      if (notification.interview.jobLink) {
        window.open(notification.interview.jobLink, '_blank');
      }
    } catch (error) {
      console.error('Error handling notification:', error);
    }
  };

  const dismissNotification = async (notificationId) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${notificationId}`, {
        method: 'DELETE'
      });
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  if (!showNotifications || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-white border-l-4 border-red-500 shadow-lg rounded-lg p-4 w-80 cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => handleNotificationClick(notification)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <Bell className="w-5 h-5 text-red-500 mr-2" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Interview Reminder</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Your interview with <strong>{notification.interview.company}</strong> for{' '}
                  <strong>{notification.interview.jobRole}</strong> is starting in 2 minutes!
                </p>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(notification.interview.interviewDate).toLocaleDateString()}
                  <Clock className="w-3 h-3 ml-3 mr-1" />
                  {notification.interview.interviewTime}
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismissNotification(notification.id);
              }}
              className="text-gray-400 hover:text-gray-600 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationHandler;