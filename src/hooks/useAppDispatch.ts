import { useDispatch } from 'react-redux';
import { DispatchType } from '../redux/store';

export const useAppDispatch = () => useDispatch<DispatchType>;
