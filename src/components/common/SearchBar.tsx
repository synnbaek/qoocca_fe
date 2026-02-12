'use client';

import React from 'react';
import { SearchIcon } from '@/components/icons/BasicIcons';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = '검색어를 입력해 주세요',
  className = '',
}: SearchBarProps) {
  return (
    <div className={`${styles.searchBarWrapper} ${className}`}>
      <div className={styles.searchIcon}>
        <SearchIcon />
      </div>
      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        aria-label="검색"
      />
    </div>
  );
}
