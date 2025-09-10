import React, { useState, useEffect } from 'react'
import './searchbarWithResults.css'
import { AnimatePresence, motion } from 'framer-motion'
import Settings from '../settings/settings'
import SearchIcon from '../assets/search-icon.svg'
import SettingsIcon from '../assets/settings-icon.svg'
import FileIcon from '../assets/file-icon.svg'
import ImageIcon from '../assets/image-icon.svg'
import VideoIcon from '../assets/video-icon.svg'
import PersonIcon from '../assets/person-icon.svg'
import LinkIcon from '../assets/link-icon.svg'
import ExternalLinkIcon from '../assets/external-link.svg'
import ChatIcon from '../assets/chat.svg'
import ListIcon from '../assets/list.svg'

const SearchbarWithResults = () => {
  // Initialize all state variables
  const [results, setResults] = useState([])
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [animatedCounts, setAnimatedCounts] = useState({})
  const [actualCounts, setActualCounts] = useState({
    all: 0,
    files: 0,
    people: 0,
    chat: 0,
    list: 0
  })
  const [enabledTabs, setEnabledTabs] = useState({
    all: true,
    files: true,
    people: true,
    chat: false,
    list: false
  })

  const calculateCounts = (results) => {
    const counts = {
      all: results.length,
      files: results.filter(item => ['file', 'image', 'video'].includes(item.type)).length,
      people: results.filter(item => item.type === 'person').length,
      chat: results.filter(item => item.type === 'chat').length,
      list: results.filter(item => item.type === 'list').length
    }
    return counts
  }

  const handleSearch = (e) => {
    const value = e.target.value
    setQuery(value)
    
    if (value.trim()) {
      setIsLoading(true)
      setShowResults(false)
      setTimeout(() => {
        setIsLoading(false)
        setShowResults(true)
      }, 2000)
    } else {
      setIsLoading(false)
      setShowResults(false)
    }
  }

  const handleToggleTab = (tabId, enabled) => {
    setEnabledTabs(prev => ({
      ...prev,
      [tabId]: enabled
    }))
  }

  // Update counts when results change
  useEffect(() => {
    if (results.length > 0) {
      setActualCounts(calculateCounts(results))
    }
  }, [results])

  // Animate counts
  useEffect(() => {
    if (!isLoading && showResults && results.length > 0) {
      Object.entries(actualCounts).forEach(([tabId, count]) => {
        let current = 0
        const interval = setInterval(() => {
          if (current < count) {
            current += 1
            setAnimatedCounts(prev => ({
              ...prev,
              [tabId]: current
            }))
          } else {
            clearInterval(interval)
          }
        }, 100)
        return () => clearInterval(interval)
      })
    } else {
      setAnimatedCounts({})
    }
  }, [isLoading, showResults, results, actualCounts])

  const tabs = [
    { id: 'all', label: 'All', count: animatedCounts.all || 0 },
    ...(enabledTabs.files ? [{ id: 'files', label: 'Files', count: animatedCounts.files || 0, icon: FileIcon }] : []),
    ...(enabledTabs.people ? [{ id: 'people', label: 'People', count: animatedCounts.people || 0, icon: PersonIcon }] : []),
    ...(enabledTabs.chat ? [{ id: 'chat', label: 'Chat', count: animatedCounts.chat || 0, icon: ChatIcon }] : []),
    ...(enabledTabs.list ? [{ id: 'list', label: 'List', count: animatedCounts.list || 0, icon: ListIcon }] : [])
  ]

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/data/searchResults.json')
        const data = await response.json()
        setResults(data.results)
      } catch (error) {
        console.error('Error fetching search results:', error)
      }
    }

    fetchResults()
  }, [])

  const SkeletonItem = ({ delay }) => (
    <motion.div 
      className="skeleton-item"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <div className="skeleton-avatar skeleton" />
      <div className="skeleton-content">
        <div className="skeleton-title skeleton" />
        <div className="skeleton-subtitle skeleton" />
      </div>
    </motion.div>
  )

  return (
    <motion.div 
      className={`searchbar-wrapper ${query ? 'expanded' : ''}`}
      layout
      animate={{ 
        scale: showSettings ? 1.2 : 1,
      }}
      transition={{ 
        duration: 0.3, 
        ease: "easeInOut",
        scale: {
          type: "spring",
          stiffness: 300,
          damping: 25
        }
      }}
    >
      <div className="search-header">
        <div className="search-icon">
          {isLoading ? (
            <div className="loader" />
          ) : (
            <img src={SearchIcon} alt="Search" />
          )}
        </div>
        <input 
          type="text" 
          value={query}
          onChange={handleSearch}
          placeholder="Searching is easier"
          className="search-input"
        />
        <div className="quick-access">
          <span className="key-indicator">S</span>
          <span className="quick-access-text">quick access</span>
        </div>
        {query && (
          <button className="clear-button" onClick={() => {
            setQuery('')
            setIsLoading(false)
            setShowResults(false)
          }}>
            Clear
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {query && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              duration: 0.4,
              ease: "easeInOut",
              opacity: { duration: 0.2 }
            }}
            style={{ overflow: "hidden" }}
          >
            <motion.div 
              className="tabs-header"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="tabs">
                {tabs.map((tab, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                  key={tab.id} 
                  className={`tab ${tab.id === activeTab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon && <img src={tab.icon} alt={tab.label} className="tab-icon" />}
                  {tab.label}
                  <span className="tab-count">{tab.count}</span>
                </motion.div>
                ))}
              </div>
              <motion.button 
                className="settings-button" 
                onClick={() => setShowSettings(!showSettings)}
                whileTap={{ scale: 0.95 }}
              >
                <motion.img 
                  src={SettingsIcon} 
                  alt="Settings"
                  animate={{ rotate: showSettings ? 90 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </motion.button>
              <AnimatePresence mode="wait">
                {showSettings && (
                  <Settings 
                    isOpen={showSettings} 
                    onClose={() => setShowSettings(false)}
                    onToggleTab={handleToggleTab}
                    enabledTabs={enabledTabs}
                  />
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div 
              className="result-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {isLoading ? (
                <>
                  {[...Array(8)].map((_, index) => (
                    <SkeletonItem key={index} delay={index * 0.1} />
                  ))}
                </>
              ) : showResults && (
                results
                  .filter(result => {
                    if (activeTab === 'all') return true;
                    if (activeTab === 'files') return ['file', 'image', 'video'].includes(result.type);
                    if (activeTab === 'people') return result.type === 'person';
                    if (activeTab === 'chat') return result.type === 'chat';
                    if (activeTab === 'list') return result.type === 'list';
                    return true;
                  })
                  .map((result, index) => (
                  <motion.div 
                    key={index} 
                    className="result-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                  >
                    {copiedId === index && (
                      <div className="copy-notification show">Link copied!</div>
                    )}
                    {result.type !== 'person' && (
                      <div className="action-buttons">
                        <button 
                          className="action-button"
                          onClick={() => {
                            setCopiedId(index)
                            setTimeout(() => setCopiedId(null), 2000)
                          }}
                        >
                          <img src={LinkIcon} alt="Copy link" />
                        </button>
                        <button className="action-button">
                          <img src={ExternalLinkIcon} alt="Open in new tab" />
                        </button>
                        <div className="link-text">New Tab</div>
                      </div>
                    )}
                    {result.type === 'person' ? (
                      <div className="result-icon">
                        <img src={PersonIcon} alt="Person" />
                        <div className={`icon-status-dot ${
                          result.subtitle === 'Active now' ? 'active' : 
                          result.subtitle === 'Unactivated' ? 'inactive' : 
                          'away'
                        }`} />
                      </div>
                    ) : (
                      <div className="result-icon">
                        {result.type === 'file' && <img src={FileIcon} alt="File" />}
                        {result.type === 'image' && <img src={ImageIcon} alt="Image" />}
                        {result.type === 'video' && <img src={VideoIcon} alt="Video" />}
                      </div>
                    )}
                    <div className="result-content">
                      <div className="result-title">{result.title}</div>
                      <div className="result-subtitle">{result.subtitle}</div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default SearchbarWithResults
