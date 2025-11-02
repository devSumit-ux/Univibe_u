-- Add triggers for chat message notifications

-- Function to create notification when a message is sent
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification for the receiver when a new message is sent
  INSERT INTO notifications (user_id, actor_id, type, entity_id)
  VALUES (
    NEW.receiver_id,
    NEW.sender_id,
    'new_message',
    NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER trigger_new_message
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION notify_new_message();
