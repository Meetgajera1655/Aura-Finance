import { Request, Response } from 'express';
import { logger } from '../../apps/backend/src/utils/logger';
import { rtdb } from '../../apps/backend/src/config/firebase';

const toArray = (obj: any) => obj ? Object.keys(obj).map(key => ({ id: key, ...obj[key] })) : [];

// Get all flashcard decks
export async function getFlashcardDecks(req: Request, res: Response) {
  try {
    const snapshot = await rtdb.ref('flashcardDecks').once('value');
    const decks = toArray(snapshot.val());
    res.status(200).json({ decks });
  } catch (error) {
    logger.error('Error fetching flashcard decks:', error);
    res.status(500).json({ error: 'Failed to fetch flashcard decks' });
  }
}

// Get flashcard deck by ID
export async function getFlashcardDeckById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const snapshot = await rtdb.ref(`flashcardDecks/${id}`).once('value');
    if (!snapshot.exists())
      return res.status(404).json({ error: 'Flashcard deck not found' });
    
    const deck = { id, ...snapshot.val() };
    if (deck.flashcards) deck.flashcards = toArray(deck.flashcards);
    res.status(200).json({ deck });
  } catch (error) {
    logger.error('Error fetching flashcard deck:', error);
    res.status(500).json({ error: 'Failed to fetch flashcard deck' });
  }
}

// Create flashcard deck
export async function createFlashcardDeck(req: Request, res: Response) {
  try {
    const { lessonId, title, description, flashcards } = req.body;
    const ref = rtdb.ref('flashcardDecks').push();

    const flashcardsObj: any = {};
    if (flashcards && Array.isArray(flashcards)) {
      flashcards.forEach((f: any) => {
        const fRef = rtdb.ref().push(); // generate unique ID
        flashcardsObj[fRef.key as string] = f;
      });
    }

    const data = {
      lessonId, title, description,
      flashcards: flashcardsObj,
      createdAt: new Date().toISOString()
    };

    await ref.set(data);
    res.status(201).json({ deck: { id: ref.key, ...data, flashcards: toArray(flashcardsObj) } });
  } catch (error) {
    logger.error('Error creating flashcard deck:', error);
    res.status(500).json({ error: 'Failed to create flashcard deck' });
  }
}

// Update flashcard deck
export async function updateFlashcardDeck(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await rtdb.ref(`flashcardDecks/${id}`).update(req.body);
    const snapshot = await rtdb.ref(`flashcardDecks/${id}`).once('value');
    const deck = { id, ...snapshot.val() };
    if (deck.flashcards) deck.flashcards = toArray(deck.flashcards);
    res.status(200).json({ deck });
  } catch (error) {
    logger.error('Error updating flashcard deck:', error);
    res.status(500).json({ error: 'Failed to update flashcard deck' });
  }
}

// Delete flashcard deck
export async function deleteFlashcardDeck(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await rtdb.ref(`flashcardDecks/${id}`).remove();
    res.status(204).end();
  } catch (error) {
    logger.error('Error deleting flashcard deck:', error);
    res.status(500).json({ error: 'Failed to delete flashcard deck' });
  }
}
