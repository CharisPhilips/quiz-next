import React, { useState, useEffect } from 'react';
import { Router } from 'next/router';
import RankingPageContent from '../../components/Pages/Ranking';
import QuizHead from '../../components/Layouts/QuizHead';
import { getToken } from '../../apis';

const ranking = () => {
  useEffect(() => {
    if (!getToken()) Router.push('/');
  }, []);

  return (
    <RankingPageContent>
      <QuizHead>
        <title>Quiz App Ranking</title>
        <meta name='description' content='Quiz App Ranking'></meta>
      </QuizHead>
    </RankingPageContent>
  );
};

export default ranking;
