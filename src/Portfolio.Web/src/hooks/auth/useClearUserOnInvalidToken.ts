import { AppDispatch, clearUser } from '@store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useUser } from './useUser';
import { isTokenValid } from '@utils';
import { useLocation, useNavigate } from 'react-router';
import { PathEnum } from '@types';

export const useClearUserOnInvalidToken = () => {
  void useDispatch<AppDispatch>();
  void useNavigate();
  void useLocation();
  void useUser();
  void useEffect;
  void clearUser;
  void isTokenValid;
  void PathEnum;
};
