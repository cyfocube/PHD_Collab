import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

interface FieldResearchArea {
  id: number;
  field: string;
  researchAreas: string[];
}

interface ResearchAreaSearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  selectedField: string; // The field selected in the department input
  label?: string;
  placeholder?: string;
  style?: any;
  onAddResearchArea?: () => void; // Callback to add the research area
}

const ResearchAreaSearchInput: React.FC<ResearchAreaSearchInputProps> = ({
  value,
  onChangeText,
  selectedField,
  label = "Add Research Area",
  placeholder = "Search...",
  style,
  onAddResearchArea,
}) => {
  const [searchText, setSearchText] = useState(value);
  const [researchAreasData, setResearchAreasData] = useState<FieldResearchArea[]>([]);
  const [availableResearchAreas, setAvailableResearchAreas] = useState<string[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const textInputRef = useRef<any>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isSelectingRef = useRef(false);

  // Load research areas data from GitHub
  const loadResearchAreas = async () => {
    if (isDataLoaded) return;
    
    setLoading(true);
    try {
      console.log('🔄 Starting to load research areas data from GitHub...');
      const response = await fetch(
        'https://raw.githubusercontent.com/cyfocube/PHD_Collab/main/database/Research_Areas/research_areas.json',
        {
          headers: {
            'Cache-Control': 'no-cache',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: FieldResearchArea[] = await response.json();
      console.log(`🔬 Successfully loaded ${data.length} fields with research areas from database`);
      console.log(`📝 First few fields: ${data.slice(0, 3).map(f => f.field).join(', ')}`);
      
      setResearchAreasData(data);
      setIsDataLoaded(true);
    } catch (error) {
      console.error('❌ Error loading research areas:', error);
      setResearchAreasData([]); // Set empty array on error
      setIsDataLoaded(true); // Still mark as loaded to prevent infinite loading
      Alert.alert(
        'Database Error',
        'Failed to load research areas database. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Update available research areas when selected field changes
  useEffect(() => {
    console.log(`🔍 Field matching effect triggered. Selected field: "${selectedField}", Data loaded: ${isDataLoaded}, Total fields available: ${researchAreasData.length}`);
    
    if (!selectedField || !isDataLoaded) {
      setAvailableResearchAreas([]);
      return;
    }

    // Find the field object that matches the selected field (comprehensive matching)
    const fieldData = researchAreasData.find(item => {
      const itemField = item.field.toLowerCase().trim();
      const searchField = selectedField.toLowerCase().trim();
      
      console.log(`🔎 Comparing: "${searchField}" with "${itemField}"`);
      
      // Exact match first
      if (itemField === searchField) {
        console.log(`✅ Exact match found: ${itemField}`);
        return true;
      }
      
      // Partial match - check if the selected field contains or is contained in the database field
      if (itemField.includes(searchField) || searchField.includes(itemField)) {
        console.log(`✅ Partial match found: ${itemField}`);
        return true;
      }
      
      // Check for common variations (e.g., "Computer Science" vs "Computer Sciences")
      const itemFieldNormalized = itemField.replace(/s$/, '').replace(/\s+/g, ' ');
      const searchFieldNormalized = searchField.replace(/s$/, '').replace(/\s+/g, ' ');
      if (itemFieldNormalized === searchFieldNormalized) {
        console.log(`✅ Normalized match found: ${itemField} (normalized: ${itemFieldNormalized})`);
        return true;
      }
      
      // Word-by-word matching (useful for fields like "Computer Science" matching "Computer Sciences")
      const itemWords = itemField.split(/\s+/).filter(w => w.length > 0);
      const searchWords = searchField.split(/\s+/).filter(w => w.length > 0);
      
      if (itemWords.length === searchWords.length) {
        const wordsMatch = itemWords.every((word, index) => {
          const searchWord = searchWords[index];
          return word === searchWord || 
                 word.replace(/s$/, '') === searchWord.replace(/s$/, '') ||
                 word.includes(searchWord) || 
                 searchWord.includes(word);
        });
        if (wordsMatch) {
          console.log(`✅ Word-by-word match found: ${itemField}`);
          return true;
        }
      }
      
      return false;
    });

    if (fieldData && fieldData.researchAreas) {
      setAvailableResearchAreas(fieldData.researchAreas);
      console.log(`🎯 Found ${fieldData.researchAreas.length} research areas for field: "${selectedField}" (matched with: "${fieldData.field}")`);
      
      // If the input is currently empty (not searching), show all available research areas
      if (searchText.length === 0) {
        setFilteredAreas(fieldData.researchAreas);
        console.log(`💡 Auto-showing all ${fieldData.researchAreas.length} research areas since no search text`);
      }
    } else {
      setAvailableResearchAreas([]);
      setFilteredAreas([]);
      console.log(`❌ No research areas found for field: "${selectedField}"`);
      console.log(`📋 Available fields in database (first 10): ${researchAreasData.slice(0, 10).map(f => `"${f.field}"`).join(', ')}`);
    }
  }, [selectedField, researchAreasData, isDataLoaded]);

  // Filter research areas based on search text
  const filterResearchAreas = (text: string) => {
    if (!text.trim()) {
      // If no search text, show all available research areas when focused
      if (selectedField && availableResearchAreas.length > 0) {
        setFilteredAreas(availableResearchAreas);
        console.log(`💡 Showing all ${availableResearchAreas.length} research areas for "${selectedField}"`);
      } else {
        setFilteredAreas([]);
      }
      return;
    }

    if (text.length < 2) {
      setFilteredAreas([]);
      return;
    }

    const searchLower = text.toLowerCase().trim();
    const searchWords = searchLower.split(' ').filter(word => word.length > 0);
    
    const filtered = availableResearchAreas.filter(area => {
      const areaLower = area.toLowerCase();
      
      // Check if all search words are present in the research area
      return searchWords.every(word => areaLower.includes(word));
    }).sort((a, b) => {
      // Prioritize matches that start with the search term
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      const firstWord = searchWords[0];
      
      const aStartsWith = aLower.startsWith(firstWord);
      const bStartsWith = bLower.startsWith(firstWord);
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      // Then prioritize by how early the match appears
      const aIndex = aLower.indexOf(firstWord);
      const bIndex = bLower.indexOf(firstWord);
      
      return aIndex - bIndex;
    }).slice(0, 50); // Limit to 50 results for performance

    setFilteredAreas(filtered);
    console.log(`🔍 Found ${filtered.length} research areas matching "${text}"`);
  };

  // Handle text input change with debouncing
  const handleTextChange = (text: string) => {
    setSearchText(text);
    onChangeText(text);
    
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // If text is empty and we have available areas, show all
    if (text.length === 0 && selectedField && availableResearchAreas.length > 0) {
      setFilteredAreas(availableResearchAreas);
      setShowSuggestions(true);
      console.log(`💡 Text cleared, showing all ${availableResearchAreas.length} research areas`);
      return;
    }
    
    // If text is too short, hide suggestions
    if (text.length < 2) {
      setShowSuggestions(false);
      setFilteredAreas([]);
      return;
    }
    
    // Debounce search to avoid too many filter calls
    debounceRef.current = setTimeout(() => {
      filterResearchAreas(text);
    }, 200);
  };

  // Handle research area selection
  const handleResearchAreaSelect = (area: string) => {
    console.log(`🔬 Research area selection triggered for: ${area}`);
    isSelectingRef.current = true;
    setSearchText(area);
    onChangeText(area);
    setShowSuggestions(false);
    setFilteredAreas([]);
    
    // Reset the selection flag after a brief delay
    setTimeout(() => {
      isSelectingRef.current = false;
    }, 100);
    console.log(`✅ Selected research area: ${area}`);
  };

  // Handle focus
  const handleFocus = async () => {
    await loadResearchAreas();
    
    // Show all research areas for the selected field when focused
    if (selectedField && availableResearchAreas.length > 0) {
      if (searchText.length >= 2) {
        // If user has typed something, filter normally
        filterResearchAreas(searchText);
      } else {
        // If no search text, show all available research areas
        setFilteredAreas(availableResearchAreas);
        setShowSuggestions(true);
        console.log(`💡 Showing all ${availableResearchAreas.length} research areas for "${selectedField}"`);
      }
    }
  };

  // Load data when component mounts or selectedField changes
  useEffect(() => {
    if (selectedField && !isDataLoaded) {
      console.log(`🚀 Auto-loading research areas because field "${selectedField}" was selected`);
      loadResearchAreas();
    }
  }, [selectedField]);

  // Handle blur
  const handleBlur = () => {
    // Don't hide suggestions if we're in the middle of selecting
    if (isSelectingRef.current) {
      return;
    }
    setTimeout(() => {
      if (!isSelectingRef.current) {
        setShowSuggestions(false);
      }
    }, 500);
  };

  // Effect to sync external value changes
  useEffect(() => {
    if (value !== searchText) {
      setSearchText(value);
    }
  }, [value]);

  // Show suggestions when filtered results are available
  useEffect(() => {
    if (filteredAreas.length > 0 && selectedField) {
      setShowSuggestions(true);
    } else if (!selectedField) {
      setShowSuggestions(false);
    }
  }, [filteredAreas, selectedField]);

  const getFieldMessage = () => {
    if (!selectedField) {
      return "Please select a field first to see research areas";
    }
    if (loading) {
      return "Loading research areas database...";
    }
    if (!isDataLoaded) {
      return "Failed to load research areas database";
    }
    if (researchAreasData.length === 0) {
      return "No research areas data available";
    }
    // Remove the "No research areas found for [Field]" message
    return "";
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        ref={textInputRef}
        label={label}
        value={searchText}
        onChangeText={handleTextChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        mode="outlined"
        placeholder={selectedField ? placeholder : "Select a field first..."}
        disabled={!selectedField || !isDataLoaded}
        style={[
          styles.textInput,
          { 
            paddingRight: searchText.length > 0 ? 60 : 40,
            marginBottom: 8,
          }
        ]}
        theme={{ roundness: 10 }}
        right={
          loading ? (
            <TextInput.Icon icon={() => <ActivityIndicator size={20} color="#6366F1" />} />
          ) : (
            <TextInput.Icon 
              icon={() => (
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  marginRight: -11
                }}>
                  {searchText.length > 0 && (
                    <TouchableOpacity 
                      onPress={() => {
                        console.log('🗑️ Clearing research area');
                        setSearchText('');
                        onChangeText('');
                        setShowSuggestions(false);
                        setFilteredAreas([]);
                        textInputRef.current?.focus();
                      }}
                      style={{ marginRight: 8 }}
                    >
                      <Ionicons name="close-circle" size={20} color="#A1A1AA" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    onPress={onAddResearchArea}
                    disabled={!searchText.trim() || !selectedField}
                    style={{ 
                      marginLeft: -10,
                      marginRight: 10,
                      padding: 4,
                      opacity: (!searchText.trim() || !selectedField) ? 0.5 : 1
                    }}
                  >
                    <Ionicons name="add-circle" size={20} color="#6366F1" />
                  </TouchableOpacity>
                </View>
              )}
            />
          )
        }
      />
      
      {/* Field info message */}
      <Text style={[styles.fieldInfoText, {
        color: loading ? '#FFAA00' : 
               (!selectedField ? '#A1A1AA' : 
               (availableResearchAreas.length > 0 ? '#22C55E' : '#EF4444'))
      }]}>
        {getFieldMessage()}
      </Text>
      
      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          <View style={styles.suggestionsHeader}>
            <Text style={styles.suggestionsTitle}>
              Research Areas for {selectedField} ({filteredAreas.length} found)
            </Text>
            <TouchableOpacity 
              onPress={() => {
                console.log('🚫 Manually closing research area suggestions');
                setShowSuggestions(false);
                setFilteredAreas([]);
              }}
              style={{ padding: 4, alignItems: 'center', justifyContent: 'center' }}
            >
              <Ionicons name="close" size={20} color="#6366F1" />
            </TouchableOpacity>
          </View>
          
          <ScrollView
            style={styles.suggestionsList}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={false}
            bounces={true}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingRight: 20 }}
            indicatorStyle="white"
            scrollIndicatorInsets={{ right: 1 }}
          >
            {filteredAreas.length > 0 ? (
              filteredAreas.map((area, index) => (
                <TouchableOpacity
                  key={`${area}-${index}`}
                  style={styles.suggestionItem}
                  onPress={() => {
                    console.log(`🎯 TouchableOpacity pressed for: ${area}`);
                    handleResearchAreaSelect(area);
                  }}
                  activeOpacity={0.7}
                  delayPressIn={100}
                  delayPressOut={100}
                >
                  <View style={styles.suggestionContent}>
                    <Text style={styles.areaName} numberOfLines={2}>
                      {area}
                    </Text>
                  </View>
                  <View style={styles.suggestionIcon}>
                    <Ionicons name="flask-outline" size={16} color="#6366F1" />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={32} color="#666666" />
                <Text style={styles.emptyText}>
                  {loading ? 'Loading research areas...' : 'No research areas found'}
                </Text>
                <Text style={styles.emptySubtext}>
                  {loading ? 'Please wait...' : 'Continue typing to refine search'}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1900, // Slightly lower than FieldSearchInput to avoid conflicts
  },
  textInput: {
    backgroundColor: '#1A1A1A',
    height: 43,
  },
  fieldInfoText: {
    fontSize: 12,
    color: '#A1A1AA',
    marginBottom: 8,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 65, // Below the TextInput and field info text
    left: 0,
    right: 0,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#333333',
    zIndex: 1900,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    backgroundColor: '#222222',
  },
  suggestionsTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  suggestionsList: {
    maxHeight: 250,
    minHeight: 100,
    paddingRight: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    backgroundColor: 'transparent',
    minHeight: 40,
  },
  suggestionContent: {
    flex: 1,
    marginRight: 8,
  },
  areaName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  suggestionIcon: {
    padding: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#A1A1AA',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default ResearchAreaSearchInput;