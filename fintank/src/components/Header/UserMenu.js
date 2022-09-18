import React from "react"
import { Dropdown, NavLink, NavItem } from "react-bootstrap"
import ActiveLink from "./../ActiveLink"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons"
import userMenu from "@data/user-menu.json"
import Avatar from "../Avatar"
export default function UserMenu({ onLinkClick }) {
  return (
    <Dropdown
      as={NavItem}
      className={userMenu.type === "avatar" ? "ms-lg-3" : ""}
    >
      <Dropdown.Toggle
        as={NavLink}
        style={userMenu.type === "avatar" && { padding: 0 }}
        className="dropdown-avatar"
      >
        {userMenu.type === "avatar" ? (
          <Avatar
            image={`/content${userMenu.img}`}
            alt={userMenu.title}
            className="me-2 avatar-border-white"
            size="sm"
            cover
          />
        ) : (
          userMenu.title
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu align="end">
        {userMenu.dropdown &&
          userMenu.dropdown.map((dropdownItem, index) =>
            !dropdownItem.divider ? (
              <ActiveLink
                key={index}
                activeClassName="active"
                href={dropdownItem.link}
                passHref
              >
                <Dropdown.Item onClick={() => onLinkClick(userMenu.title)}>
                  {dropdownItem.signout && (
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className="me-2 text-muted"
                    />
                  )}
                  {dropdownItem.title}
                </Dropdown.Item>
              </ActiveLink>
            ) : (
              <Dropdown.Divider key={index} />
            )
          )}
      </Dropdown.Menu>
    </Dropdown>
  )
}
