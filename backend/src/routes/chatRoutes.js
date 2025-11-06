import express from 'express';
import Chat from '../models/Chat.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create or get existing chat
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { participantId, relatedTo } = req.body;
    
    // Check if chat already exists between these users
    const existingChat = await Chat.findOne({
      'participants.userId': { $all: [req.user.userId, participantId] },
      isActive: true
    });

    if (existingChat) {
      return res.json({ chat: existingChat });
    }

    const chatId = 'CHAT' + Date.now() + Math.random().toString(36).substr(2, 5);

    const chat = new Chat({
      chatId,
      participants: [
        { userId: req.user.userId, role: req.user.role },
        { userId: participantId }
      ],
      relatedTo
    });

    await chat.save();
    await chat.populate('participants.userId', 'name profilePicUrl');

    res.status(201).json({ message: 'Chat created successfully', chat });
  } catch (error) {
    res.status(500).json({ message: 'Error creating chat', error: error.message });
  }
});

// Get user's chats
router.get('/my-chats', authenticateToken, async (req, res) => {
  try {
    const chats = await Chat.find({
      'participants.userId': req.user.userId,
      isActive: true
    })
    .populate('participants.userId', 'name profilePicUrl role')
    .populate('relatedTo.referenceId')
    .sort({ 'lastMessage.timestamp': -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats', error: error.message });
  }
});

// Get chat by ID
router.get('/:chatId', authenticateToken, async (req, res) => {
  try {
    const chat = await Chat.findOne({ chatId: req.params.chatId })
      .populate('participants.userId', 'name profilePicUrl role')
      .populate('messages.senderId', 'name profilePicUrl');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(p => 
      p.userId._id.toString() === req.user.userId
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to view this chat' });
    }

    // Mark messages as read
    chat.messages.forEach(message => {
      if (message.senderId._id.toString() !== req.user.userId && !message.isRead) {
        message.isRead = true;
        message.readAt = new Date();
      }
    });

    await chat.save();
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat', error: error.message });
  }
});

// Send message
router.post('/:chatId/message', authenticateToken, async (req, res) => {
  try {
    const { content, messageType = 'text', attachments = [] } = req.body;
    
    const chat = await Chat.findOne({ chatId: req.params.chatId });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(p => 
      p.userId.toString() === req.user.userId
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to send message' });
    }

    const message = {
      senderId: req.user.userId,
      content,
      messageType,
      attachments
    };

    chat.messages.push(message);
    chat.lastMessage = {
      content,
      senderId: req.user.userId,
      timestamp: new Date()
    };

    await chat.save();
    await chat.populate('messages.senderId', 'name profilePicUrl');

    const newMessage = chat.messages[chat.messages.length - 1];
    res.json({ message: 'Message sent successfully', messageData: newMessage });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
});

// Send price quote/negotiation
router.post('/:chatId/negotiate', authenticateToken, async (req, res) => {
  try {
    const { amount, quantity, message } = req.body;
    
    const chat = await Chat.findOne({ chatId: req.params.chatId });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(p => 
      p.userId.toString() === req.user.userId
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Add to negotiation history
    if (chat.negotiation.currentOffer.proposedBy) {
      chat.negotiation.history.push({
        amount: chat.negotiation.currentOffer.amount,
        quantity: chat.negotiation.currentOffer.quantity,
        proposedBy: chat.negotiation.currentOffer.proposedBy,
        status: 'counter'
      });
    }

    // Set new current offer
    chat.negotiation.isNegotiating = true;
    chat.negotiation.currentOffer = {
      amount: Number(amount),
      quantity: Number(quantity),
      proposedBy: req.user.userId,
      status: 'pending'
    };

    // Add message
    const negotiationMessage = {
      senderId: req.user.userId,
      content: message || `Price quote: ₹${amount} for ${quantity} units`,
      messageType: 'price-quote'
    };

    chat.messages.push(negotiationMessage);
    chat.lastMessage = {
      content: negotiationMessage.content,
      senderId: req.user.userId,
      timestamp: new Date()
    };

    await chat.save();
    res.json({ message: 'Price quote sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending price quote', error: error.message });
  }
});

// Accept/Reject negotiation
router.post('/:chatId/negotiate/respond', authenticateToken, async (req, res) => {
  try {
    const { action, message } = req.body; // action: 'accept' or 'reject'
    
    const chat = await Chat.findOne({ chatId: req.params.chatId });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.negotiation.currentOffer.proposedBy) {
      return res.status(400).json({ message: 'No active negotiation found' });
    }

    // Check if user is the other participant (not the one who proposed)
    if (chat.negotiation.currentOffer.proposedBy.toString() === req.user.userId) {
      return res.status(400).json({ message: 'Cannot respond to your own offer' });
    }

    chat.negotiation.currentOffer.status = action === 'accept' ? 'accepted' : 'rejected';

    // Add response message
    const responseMessage = {
      senderId: req.user.userId,
      content: message || `Offer ${action}ed`,
      messageType: 'price-quote'
    };

    chat.messages.push(responseMessage);
    chat.lastMessage = {
      content: responseMessage.content,
      senderId: req.user.userId,
      timestamp: new Date()
    };

    if (action === 'accept') {
      chat.negotiation.isNegotiating = false;
    }

    await chat.save();
    res.json({ 
      message: `Offer ${action}ed successfully`,
      negotiationComplete: action === 'accept'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error responding to negotiation', error: error.message });
  }
});

// Get unread message count
router.get('/unread/count', authenticateToken, async (req, res) => {
  try {
    const chats = await Chat.find({
      'participants.userId': req.user.userId,
      isActive: true
    });

    let unreadCount = 0;
    chats.forEach(chat => {
      chat.messages.forEach(message => {
        if (message.senderId.toString() !== req.user.userId && !message.isRead) {
          unreadCount++;
        }
      });
    });

    res.json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unread count', error: error.message });
  }
});

export default router;