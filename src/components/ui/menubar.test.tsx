import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from './menubar';

describe('Menubar', () => {
  it('renders menubar with menus', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
            <MenubarItem>Open</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    expect(screen.getByText('File')).toBeInTheDocument();
  });

  it('renders multiple menus', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Undo</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });
});
