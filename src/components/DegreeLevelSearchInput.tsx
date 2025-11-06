import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

interface DegreeLevelSearchInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: any;
}

interface DegreeLevel {
  id: string;
  level: string;
  description: string;
  category: string;
}

const DegreeLevelSearchInput: React.FC<DegreeLevelSearchInputProps> = ({
  label,
  value,
  onChangeText,
  style,
}) => {
  const [searchText, setSearchText] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredLevels, setFilteredLevels] = useState<DegreeLevel[]>([]);
  const [loading, setLoading] = useState(false);
  const textInputRef = useRef<any>(null);

  // Academic degree levels only
  const degreeLevels: DegreeLevel[] = [
    // Pre-University
    { id: '1', level: 'High School Diploma', description: 'Secondary education completion', category: 'Pre-University' },
    
    // Undergraduate Degrees
    { id: '2', level: 'Associate Degree', description: '2-year undergraduate degree', category: 'Undergraduate' },
    { id: '3', level: 'Bachelor\'s Degree', description: '4-year undergraduate degree', category: 'Undergraduate' },
    { id: '4', level: 'Bachelor of Arts (BA)', description: 'Liberal arts undergraduate degree', category: 'Undergraduate' },
    { id: '5', level: 'Bachelor of Science (BS)', description: 'Science undergraduate degree', category: 'Undergraduate' },
    { id: '6', level: 'Bachelor of Engineering (BE)', description: 'Engineering undergraduate degree', category: 'Undergraduate' },
    { id: '7', level: 'Bachelor of Technology (BTech)', description: 'Technology undergraduate degree', category: 'Undergraduate' },
    { id: '8', level: 'Bachelor of Business Administration (BBA)', description: 'Business undergraduate degree', category: 'Undergraduate' },
    { id: '9', level: 'Bachelor of Fine Arts (BFA)', description: 'Fine arts undergraduate degree', category: 'Undergraduate' },
    { id: '10', level: 'Bachelor of Medicine (MBBS)', description: 'Medical undergraduate degree', category: 'Undergraduate' },
    
    // Graduate Degrees
    { id: '11', level: 'Master\'s Degree', description: 'Graduate level degree', category: 'Graduate' },
    { id: '12', level: 'Master of Arts (MA)', description: 'Liberal arts graduate degree', category: 'Graduate' },
    { id: '13', level: 'Master of Science (MS)', description: 'Science graduate degree', category: 'Graduate' },
    { id: '14', level: 'Master of Engineering (MEng)', description: 'Engineering graduate degree', category: 'Graduate' },
    { id: '15', level: 'Master of Technology (MTech)', description: 'Technology graduate degree', category: 'Graduate' },
    { id: '16', level: 'Master of Business Administration (MBA)', description: 'Business graduate degree', category: 'Graduate' },
    { id: '17', level: 'Master of Fine Arts (MFA)', description: 'Fine arts graduate degree', category: 'Graduate' },
    { id: '18', level: 'Master of Education (MEd)', description: 'Education graduate degree', category: 'Graduate' },
    { id: '19', level: 'Master of Public Health (MPH)', description: 'Public health graduate degree', category: 'Graduate' },
    { id: '20', level: 'Master of Social Work (MSW)', description: 'Social work graduate degree', category: 'Graduate' },
    { id: '21', level: 'Master of Laws (LLM)', description: 'Law graduate degree', category: 'Graduate' },
    { id: '22', level: 'Master of Philosophy (MPhil)', description: 'Research-based graduate degree', category: 'Graduate' },
    
    // Doctoral Degrees
    { id: '23', level: 'PhD', description: 'Doctor of Philosophy', category: 'Doctoral' },
    { id: '24', level: 'Doctor of Philosophy (PhD)', description: 'Highest academic degree', category: 'Doctoral' },
    { id: '25', level: 'Doctor of Education (EdD)', description: 'Education doctoral degree', category: 'Doctoral' },
    { id: '26', level: 'Doctor of Medicine (MD)', description: 'Medical doctoral degree', category: 'Doctoral' },
    { id: '27', level: 'Doctor of Dental Medicine (DMD)', description: 'Dental doctoral degree', category: 'Doctoral' },
    { id: '28', level: 'Doctor of Veterinary Medicine (DVM)', description: 'Veterinary doctoral degree', category: 'Doctoral' },
    { id: '29', level: 'Juris Doctor (JD)', description: 'Law doctoral degree', category: 'Doctoral' },
    { id: '30', level: 'Doctor of Pharmacy (PharmD)', description: 'Pharmacy doctoral degree', category: 'Doctoral' },
    { id: '31', level: 'Doctor of Psychology (PsyD)', description: 'Psychology doctoral degree', category: 'Doctoral' },
    { id: '32', level: 'Doctor of Business Administration (DBA)', description: 'Business doctoral degree', category: 'Doctoral' },
    { id: '33', level: 'Doctor of Engineering (DEng)', description: 'Engineering doctoral degree', category: 'Doctoral' },
    { id: '34', level: 'Doctor of Science (DSc)', description: 'Science doctoral degree', category: 'Doctoral' },
    
    // Professional Certificates & Diplomas
    { id: '35', level: 'Certificate', description: 'Professional certificate program', category: 'Professional' },
    { id: '36', level: 'Diploma', description: 'Professional diploma program', category: 'Professional' },
    { id: '37', level: 'Professional Certificate', description: 'Specialized professional certificate', category: 'Professional' },
    { id: '38', level: 'Graduate Certificate', description: 'Post-graduate certificate program', category: 'Professional' },
    { id: '39', level: 'Postgraduate Diploma', description: 'Post-graduate diploma program', category: 'Professional' },
    { id: '40', level: 'Postdoctoral Fellowship', description: 'Post-PhD research training', category: 'Professional' },
  ];

  // Handle text input changes
  const handleTextChange = (text: string) => {
    setSearchText(text);
    onChangeText(text);
    filterLevels(text);
  };

  // Filter degree levels based on search text
  const filterLevels = (text: string) => {
    // If no search text, show all degree levels
    if (!text.trim() || text.length < 1) {
      const sortedAll = degreeLevels.sort((a, b) => {
        // Sort by category first, then alphabetically within category
        if (a.category !== b.category) {
          const categoryOrder = ['Pre-University', 'Undergraduate', 'Graduate', 'Doctoral', 'Professional'];
          return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
        }
        return a.level.localeCompare(b.level);
      });
      setFilteredLevels(sortedAll);
      setShowSuggestions(true);
      return;
    }

    const searchLower = text.toLowerCase().trim();
    const searchWords = searchLower.split(' ').filter(word => word.length > 0);
    
    const filtered = degreeLevels.filter(level => {
      const levelLower = level.level.toLowerCase();
      const descriptionLower = level.description.toLowerCase();
      const categoryLower = level.category.toLowerCase();
      
      // Check if any search word matches the level name, description, or category
      return searchWords.some(word => 
        levelLower.includes(word) || 
        descriptionLower.includes(word) || 
        categoryLower.includes(word)
      );
    });

    // Sort by relevance (exact matches first, then starts with, then contains)
    const sorted = filtered.sort((a, b) => {
      const aLevel = a.level.toLowerCase();
      const bLevel = b.level.toLowerCase();
      
      // Exact match gets highest priority
      if (aLevel === searchLower) return -1;
      if (bLevel === searchLower) return 1;
      
      // Starts with gets second priority
      if (aLevel.startsWith(searchLower) && !bLevel.startsWith(searchLower)) return -1;
      if (bLevel.startsWith(searchLower) && !aLevel.startsWith(searchLower)) return 1;
      
      // Then alphabetical
      return aLevel.localeCompare(bLevel);
    });

    setFilteredLevels(sorted.slice(0, 50)); // Limit to 50 results
    setShowSuggestions(true);
  };

  // Handle degree level selection
  const handleLevelSelect = (level: DegreeLevel) => {
    console.log(`🎯 Selected degree level: ${level.level}`);
    setSearchText(level.level);
    onChangeText(level.level);
    setShowSuggestions(false);
    setFilteredLevels([]);
  };

  // Handle focus
  const handleFocus = () => {
    // Always show suggestions on focus, regardless of search text length
    filterLevels(searchText);
  };

  // Handle blur
  const handleBlur = () => {
    // Delay hiding suggestions to allow for touch events
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
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
        placeholder="Search"
        style={[
          styles.textInput,
          { 
            paddingRight: searchText.length > 0 ? 60 : 40,
            paddingLeft: 0,
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0
          },
          style
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
                        console.log('🗑️ Clearing degree level field');
                        setSearchText('');
                        onChangeText('');
                        setShowSuggestions(false);
                        setFilteredLevels([]);
                        textInputRef.current?.focus();
                      }}
                      style={{ 
                        marginLeft: 0,     // Move cancel icon left/right
                        marginRight: -4,    // Move cancel icon right/left  
                        marginTop: 0,      // Move cancel icon up/down
                        marginBottom: 0,   // Move cancel icon down/up
                        padding: -2       // Add padding around the touch area
                      }}
                    >
                      <Ionicons name="close-circle" size={20} color="#A1A1AA" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    onPress={() => textInputRef.current?.focus()}
                    style={{
                      marginLeft: 0,     // Move search icon left/right
                      marginRight: 10,   // Move search icon right/left  
                      marginTop: 0,      // Move search icon up/down
                      marginBottom: 0,   // Move search icon down/up
                      padding: 4         // Add padding around the touch area
                    }}
                  >
                    <Ionicons name="school" size={20} color="#6366F1" />
                  </TouchableOpacity>
                </View>
              )}
            />
          )
        }
      />
      
      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          <View style={styles.suggestionsHeader}>
            <Text style={styles.suggestionsTitle}>
              {`Degree Levels (${filteredLevels.length} found)`}
            </Text>
            <TouchableOpacity 
              onPress={() => {
                console.log('🚫 Manually closing suggestions');
                setShowSuggestions(false);
                setFilteredLevels([]);
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
            {filteredLevels.length > 0 ? (
              filteredLevels.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.suggestionItem}
                  onPress={() => {
                    console.log(`🎯 TouchableOpacity pressed for: ${item.level}`);
                    handleLevelSelect(item);
                  }}
                  activeOpacity={0.7}
                  delayPressIn={100}
                  delayPressOut={100}
                >
                  <View style={styles.suggestionContent}>
                    <Text style={styles.levelName} numberOfLines={1}>
                      {item.level}
                    </Text>
                    <Text style={styles.levelDescription} numberOfLines={1}>
                      {item.description} • {item.category}
                    </Text>
                  </View>
                  <View style={styles.suggestionIcon}>
                    <Ionicons name="school-outline" size={16} color="#6366F1" />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={32} color="#666666" />
                <Text style={styles.emptyText}>
                  {loading ? 'Loading degree levels...' : 'No degree levels found'}
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
    zIndex: 1000,
  },
  textInput: {
    backgroundColor: '#1A1A1A',
    height: 43,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    maxHeight: 250,
    borderWidth: 1,
    borderColor: '#333333',
    zIndex: 1000,
    elevation: 5,
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
    fontSize: 13,
    fontWeight: '600',
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    backgroundColor: 'transparent',
    minHeight: 36,
  },
  suggestionContent: {
    flex: 1,
    marginRight: 8,
  },
  levelName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 16,
  },
  levelDescription: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 14,
    marginTop: 2,
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
    fontWeight: '400',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default DegreeLevelSearchInput;