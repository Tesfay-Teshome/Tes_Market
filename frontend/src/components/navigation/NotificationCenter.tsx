import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, Check, Trash2 } from 'lucide-react';
import { RootState } from '@/store';
import { markAllAsRead, clearNotifications } from '@/store/slices/notificationSlice';
import { format } from 'date-fns';

const NotificationCenter = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector(
    (state: RootState) => state.notification
  );
  const [isOpen, setIsOpen] = React.useState(false);

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleClearAll = () => {
    dispatch(clearNotifications());
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleMarkAllAsRead}
                  className="p-1 text-gray-600 hover:text-blue-600"
                  title="Mark all as read"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={handleClearAll}
                  className="p-1 text-gray-600 hover:text-red-600"
                  title="Clear all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(notification.createdAt), 'MMM d, yyyy HH:mm')}
                      </p>
                    </div>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        notification.type === 'success'
                          ? 'bg-green-500'
                          : notification.type === 'warning'
                          ? 'bg-yellow-500'
                          : notification.type === 'error'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter