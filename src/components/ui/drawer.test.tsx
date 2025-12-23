import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from './drawer';

describe('Drawer', () => {
  it('renders drawer trigger', () => {
    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Title</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    expect(screen.getByText('Open Drawer')).toBeInTheDocument();
  });

  it('opens drawer on trigger click', () => {
    render(
      <Drawer>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerDescription>Description</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>Footer</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
    fireEvent.click(screen.getByText('Open'));
  });
});
