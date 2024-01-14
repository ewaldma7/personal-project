'use client'
import { Menu, Button, Text, rem, Avatar } from '@mantine/core';
import {
    IconSearch,
    IconTrash,
    IconArrowsLeftRight,
} from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface MenuProps {
    name: string;
}

const ProfileMenu: React.FC<MenuProps> = ({ name }) => {
    const router = useRouter();
    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/");
    }
    return (
        <Menu shadow="md" width={200} trigger="hover" openDelay={100} closeDelay={100}>
            <Menu.Target>
                <Avatar>{name[0]}</Avatar>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item
                    leftSection={<IconSearch style={{ width: rem(14), height: rem(14) }} />}
                    rightSection={
                        <Text size="xs" c="dimmed">
                            ⌘K
                        </Text>
                    }
                >
                    Search
                </Menu.Item>
                <Menu.Item
                    leftSection={<IconArrowsLeftRight style={{ width: rem(14), height: rem(14) }} />}
                >
                    Transfer my data
                </Menu.Item>
                <Menu.Item
                    color="red"
                    leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                    onClick={handleSignOut}
                >
                    Sign Out
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}

export default ProfileMenu;