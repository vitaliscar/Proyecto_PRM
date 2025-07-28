import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Phaser from 'phaser';
import api from '@/services/api';

interface Game {
  id: string;
  type: string;
  points: number;
}

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.add.text(100, 100, 'Juego Educativo - Proyecto Creces', {
      color: '#000',
      fontSize: '24px',
      fontFamily: 'Inter, Roboto, sans-serif',
    });
  }
}

const GamificationPage: React.FC = () => {
  const { t } = useTranslation();
  const gameRef = useRef<HTMLDivElement>(null);

  const { data: gameData, isLoading } = useQuery<Game>({
    queryKey: ['game'],
    queryFn: async () => {
      const simulatedData: Game = { id: '1', type: 'game', points: 100 };
      try {
        const response = await api.get('/gamification/');
        return response.data || simulatedData;
      } catch {
        return simulatedData;
      }
    },
  });

  useEffect(() => {
    if (gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: gameRef.current,
        scene: GameScene,
        backgroundColor: '#E8F5E9', // Verde pastel
      };
      const game = new Phaser.Game(config);
      return () => game.destroy(true);
    }
  }, []);

  return (
    <div className="container mx-auto p-4 bg-secondary">
      <h1 className="text-2xl font-bold mb-4">{t('gamification.title')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('gamification.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <>
              <p className="mb-4"><strong>{t('gamification.points')}:</strong> {gameData?.points}</p>
              <div ref={gameRef} className="border rounded" />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationPage;
