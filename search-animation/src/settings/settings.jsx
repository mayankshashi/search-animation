import React from 'react'
import './settings.css'
import ListIcon from '../assets/list.svg'
import ChatIcon from '../assets/chat.svg'
import FilesIcon from '../assets/file-icon.svg'
import PeopleIcon from '../assets/person-icon.svg'
import { motion, AnimatePresence } from 'framer-motion'

const Settings = ({ isOpen, onToggleTab, enabledTabs }) => {
  if (!isOpen) return null

  const tabs = [
    { id: 'files', label: 'Files', icon: FilesIcon },
    { id: 'people', label: 'People', icon: PeopleIcon },  
    { id: 'chat', label: 'Chat', icon: ChatIcon },
    { id: 'list', label: 'List', icon: ListIcon }
  ]

  return (
    <motion.div 
      className="settings-window"
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <motion.div 
        className="settings-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.2 }}
      >
        {tabs.map((tab, i) => (
          <motion.div 
            key={tab.id} 
            className="settings-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + (i * 0.05), duration: 0.2, ease: "easeOut" }}
          >
            <div className="settings-item-left">
              {tab.icon && <img src={tab.icon} alt="" className="settings-item-icon" />}
              <span className="settings-item-label">{tab.label}</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={enabledTabs[tab.id]}
                onChange={(e) => onToggleTab(tab.id, e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default Settings
