"use client";
import { Menu, rem, Avatar } from "@mantine/core";
import { IconTrash, IconBell } from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface MenuProps {
  name: string;
}

const ProfileMenu: React.FC<MenuProps> = ({ name }) => {
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };
  return (
    <Menu
      shadow="md"
      width={250}
      trigger="click"
      openDelay={100}
      closeDelay={100}
    >
      <Menu.Target>
        <Avatar style={{ cursor: "pointer" }}>{name[0]}</Avatar>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconBell style={{ width: rem(14), height: rem(14) }} />}
          onClick={() => router.push("/notifications")}
        >
          Notifications
        </Menu.Item>
        <Menu.Item
          color="red"
          leftSection={
            <IconTrash style={{ width: rem(14), height: rem(14) }} />
          }
          onClick={handleSignOut}
        >
          Sign Out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProfileMenu;
