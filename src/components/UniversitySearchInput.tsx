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

interface University {
  number: number;
  country: string;
  school: string;
}

// Mapping from phone country codes to university database country names
const countryMapping: { [key: string]: string[] } = {
  'United States': ['United States'],
  'United Kingdom': ['United Kingdom', 'England', 'Scotland', 'Wales', 'Northern Ireland'],
  'Canada': ['Canada'],
  'Australia': ['Australia'],
  'Germany': ['Germany'],
  'France': ['France'],
  'Italy': ['Italy'],
  'Spain': ['Spain'],
  'Netherlands': ['Netherlands'],
  'Switzerland': ['Switzerland'],
  'Austria': ['Austria'],
  'Belgium': ['Belgium'],
  'Denmark': ['Denmark'],
  'Sweden': ['Sweden'],
  'Norway': ['Norway'],
  'Finland': ['Finland'],
  'Poland': ['Poland'],
  'Czech Republic': ['Czech Republic'],
  'Hungary': ['Hungary'],
  'Portugal': ['Portugal'],
  'Greece': ['Greece'],
  'Russia': ['Russia'],
  'Ukraine': ['Ukraine'],
  'Ireland': ['Ireland'],
  'China': ['China'],
  'Japan': ['Japan'],
  'South Korea': ['South Korea'],
  'India': ['India'],
  'Pakistan': ['Pakistan'],
  'Bangladesh': ['Bangladesh'],
  'Sri Lanka': ['Sri Lanka'],
  'Myanmar': ['Myanmar'],
  'Thailand': ['Thailand'],
  'Vietnam': ['Vietnam'],
  'Malaysia': ['Malaysia'],
  'Singapore': ['Singapore'],
  'Indonesia': ['Indonesia'],
  'Philippines': ['Philippines'],
  'Hong Kong': ['Hong Kong'],
  'Taiwan': ['Taiwan'],
  'Macau': ['Macau'],
  'Mongolia': ['Mongolia'],
  'Kazakhstan': ['Kazakhstan'],
  'Uzbekistan': ['Uzbekistan'],
  'Kyrgyzstan': ['Kyrgyzstan'],
  'Tajikistan': ['Tajikistan'],
  'Turkmenistan': ['Turkmenistan'],
  'Azerbaijan': ['Azerbaijan'],
  'Georgia': ['Georgia'],
  'Armenia': ['Armenia'],
  'UAE': ['United Arab Emirates', 'UAE'],
  'Saudi Arabia': ['Saudi Arabia'],
  'Israel': ['Israel'],
  'Turkey': ['Turkey'],
  'Iran': ['Iran'],
  'Iraq': ['Iraq'],
  'Jordan': ['Jordan'],
  'Lebanon': ['Lebanon'],
  'Syria': ['Syria'],
  'Kuwait': ['Kuwait'],
  'Oman': ['Oman'],
  'Bahrain': ['Bahrain'],
  'Qatar': ['Qatar'],
  'Yemen': ['Yemen'],
  'Nigeria': ['Nigeria'],
  'South Africa': ['South Africa'],
  'Egypt': ['Egypt'],
  'Morocco': ['Morocco'],
  'Tunisia': ['Tunisia'],
  'Algeria': ['Algeria'],
  'Libya': ['Libya'],
  'Sudan': ['Sudan'],
  'Ethiopia': ['Ethiopia'],
  'Kenya': ['Kenya'],
  'Tanzania': ['Tanzania'],
  'Uganda': ['Uganda'],
  'Rwanda': ['Rwanda'],
  'Ghana': ['Ghana'],
  'Ivory Coast': ['Ivory Coast', 'Côte d\'Ivoire'],
  'Senegal': ['Senegal'],
  'Mali': ['Mali'],
  'Burkina Faso': ['Burkina Faso'],
  'Niger': ['Niger'],
  'Benin': ['Benin'],
  'Togo': ['Togo'],
  'Gambia': ['Gambia'],
  'Guinea': ['Guinea'],
  'Guinea-Bissau': ['Guinea-Bissau'],
  'Cape Verde': ['Cape Verde'],
  'Sierra Leone': ['Sierra Leone'],
  'Liberia': ['Liberia'],
  'Zambia': ['Zambia'],
  'Zimbabwe': ['Zimbabwe'],
  'Malawi': ['Malawi'],
  'Mozambique': ['Mozambique'],
  'Namibia': ['Namibia'],
  'Botswana': ['Botswana'],
  'Eswatini': ['Eswatini', 'Swaziland'],
  'Lesotho': ['Lesotho'],
  'Brazil': ['Brazil'],
  'Argentina': ['Argentina'],
  'Chile': ['Chile'],
  'Colombia': ['Colombia'],
  'Peru': ['Peru'],
  'Venezuela': ['Venezuela'],
  'Ecuador': ['Ecuador'],
  'Paraguay': ['Paraguay'],
  'Uruguay': ['Uruguay'],
  'Bolivia': ['Bolivia'],
  'Guyana': ['Guyana'],
  'Suriname': ['Suriname'],
  'New Zealand': ['New Zealand'],
  'Fiji': ['Fiji'],
  'Samoa': ['Samoa'],
  'Tonga': ['Tonga'],
  'Vanuatu': ['Vanuatu'],
  'Mexico': ['Mexico'],
};

interface UniversitySearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  style?: any;
  countryFilter?: string; // Country to filter universities by
}

const UniversitySearchInput: React.FC<UniversitySearchInputProps> = ({
  value,
  onChangeText,
  label = "University",
  placeholder = "Search for your university...",
  style,
  countryFilter,
}) => {
  const [searchText, setSearchText] = useState(value);
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const textInputRef = useRef<any>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isSelectingRef = useRef(false);

  // Load universities data from GitHub
  const loadUniversities = async () => {
    if (isDataLoaded) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/cyfocube/PHD_Collab/main/database/Schools/global_universities.json',
        {
          headers: {
            'Cache-Control': 'no-cache',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: University[] = await response.json();
      console.log(`📚 Loaded ${data.length} universities from database`);
      setUniversities(data);
      setIsDataLoaded(true);
    } catch (error) {
      console.error('Error loading universities:', error);
      Alert.alert(
        'Database Error',
        'Failed to load universities database. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter universities based on search text
  const filterUniversities = (text: string) => {
    if (!text.trim() || text.length < 2) {
      setFilteredUniversities([]);
      return;
    }

    const searchLower = text.toLowerCase().trim();
    const searchWords = searchLower.split(' ').filter(word => word.length > 0);
    
    // First filter by country if countryFilter is provided
    let universityPool = universities;
    if (countryFilter) {
      const mappedCountries = countryMapping[countryFilter] || [countryFilter];
      universityPool = universities.filter(uni => 
        mappedCountries.some(country => 
          uni.country.toLowerCase() === country.toLowerCase()
        )
      );
      console.log(`🌍 Filtering ${universityPool.length} universities from ${countryFilter} (mapped to: ${mappedCountries.join(', ')})`);
    }
    
    // Use a Map to efficiently remove duplicates while filtering
    const uniqueUniversities = new Map<string, University>();
    
    universityPool.forEach(uni => {
      const schoolLower = uni.school.toLowerCase();
      const countryLower = uni.country.toLowerCase();
      const combinedText = `${schoolLower} ${countryLower}`;
      
      // Check if all search words are present in school name or country
      const matches = searchWords.every(word => 
        schoolLower.includes(word) || countryLower.includes(word) || combinedText.includes(word)
      );
      
      if (matches) {
        // Use school name + country as unique key to prevent duplicates
        const uniqueKey = `${schoolLower}|||${countryLower}`;
        
        // Only add if not already present (keeps first occurrence)
        if (!uniqueUniversities.has(uniqueKey)) {
          uniqueUniversities.set(uniqueKey, uni);
        }
      }
    });
    
    const filtered = Array.from(uniqueUniversities.values())
      .sort((a, b) => {
        // Prioritize matches that start with the search term
        const aSchoolLower = a.school.toLowerCase();
        const bSchoolLower = b.school.toLowerCase();
        const firstWord = searchWords[0];
        
        const aStartsWith = aSchoolLower.startsWith(firstWord);
        const bStartsWith = bSchoolLower.startsWith(firstWord);
        
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        
        // Then prioritize by how early the match appears
        const aIndex = aSchoolLower.indexOf(firstWord);
        const bIndex = bSchoolLower.indexOf(firstWord);
        
        return aIndex - bIndex;
      })
      .slice(0, 100);

    setFilteredUniversities(filtered);
    console.log(`🔍 Found ${filtered.length} unique universities matching "${text}" (${universityPool.length} total in pool)`);
  };

  // Handle text input change with debouncing
  const handleTextChange = (text: string) => {
    setSearchText(text);
    
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // If text is too short, hide suggestions immediately
    if (text.length < 2) {
      setShowSuggestions(false);
      setFilteredUniversities([]);
      return;
    }
    
    // Debounce search to avoid too many filter calls
    debounceRef.current = setTimeout(() => {
      filterUniversities(text);
    }, 200); // Reduced debounce time for more responsive search
  };

  // Handle university selection
  const handleUniversitySelect = (university: University) => {
    console.log(`🔥 University selection triggered for: ${university.school}`);
    isSelectingRef.current = true;
    const universityName = university.school; // Only use school name, no country
    setSearchText(universityName);
    onChangeText(universityName);
    setShowSuggestions(false);
    setFilteredUniversities([]);
    // Reset the selection flag after a brief delay
    setTimeout(() => {
      isSelectingRef.current = false;
    }, 100);
    console.log(`✅ Selected university: ${universityName}`);
  };

  // Handle focus
  const handleFocus = async () => {
    await loadUniversities();
    if (searchText.length >= 2) {
      filterUniversities(searchText);
    }
  };

  // Handle blur
  const handleBlur = () => {
    // Don't hide suggestions if we're in the middle of selecting or scrolling
    if (isSelectingRef.current) {
      return;
    }
    // Longer delay to allow for scrolling and selection
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

  // Effect to reset search when country filter changes
  useEffect(() => {
    if (searchText.length >= 2) {
      filterUniversities(searchText);
    } else {
      setFilteredUniversities([]);
      setShowSuggestions(false);
    }
  }, [countryFilter]);

  // Show suggestions when filtered results are available and text input is focused
  useEffect(() => {
    // Only show suggestions if we have results and text is long enough
    if (filteredUniversities.length > 0 && searchText.length >= 2) {
      setShowSuggestions(true);
    } else if (searchText.length < 2) {
      setShowSuggestions(false);
    }
  }, [filteredUniversities, searchText]);

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
              paddingRight: searchText.length > 0 ? 60 : 40,  // Less padding, icons moved left
              paddingLeft: 0,  // Add left padding so cursor doesn't touch the border
              marginBottom: 16,  // Add margin below the field
              marginTop: 0,      // Add margin above the field
              marginLeft: 0,     // Add margin to the left
              marginRight: 0     // Add margin to the right
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
                    marginRight: - 11 // Shift icons to the left
                  }}>
                    {searchText.length > 0 && (
                      <TouchableOpacity 
                        onPress={() => {
                          console.log('🗑️ Clearing university field');
                          setSearchText('');
                          onChangeText('');
                          setShowSuggestions(false);
                          setFilteredUniversities([]);
                          textInputRef.current?.focus();
                        }}
                        style={{ marginRight: 8 }}  // Reduced spacing between icons
                      >
                        <Ionicons name="close-circle" size={20} color="#A1A1AA" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity 
                      onPress={() => {
                        if (searchText.length >= 2) {
                          filterUniversities(searchText);
                          setShowSuggestions(true);
                        }
                      }}
                      style={{ 
                        marginLeft: -10,     // Move search icon left/right
                        marginRight: 10,    // Move search icon right/left  
                        marginTop: 0,      // Move search icon up/down
                        marginBottom: 0,   // Move search icon down/up
                        padding: 4         // Add padding around the touch area
                      }}
                    >
                      <Ionicons name="search" size={20} color="#6366F1" />
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
              {countryFilter ? `${countryFilter} Universities (${filteredUniversities.length})` : `Universities (${filteredUniversities.length} found)`}
            </Text>
            <TouchableOpacity 
              onPress={() => {
                console.log('🚫 Manually closing suggestions');
                setShowSuggestions(false);
                setFilteredUniversities([]);
              }}
              style={{ padding: 4 }}
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
            {filteredUniversities.length > 0 ? (
              filteredUniversities.map((item) => (
                <TouchableOpacity
                  key={`${item.number}-${item.school}`}
                  style={styles.suggestionItem}
                  onPress={() => {
                    console.log(`🎯 TouchableOpacity pressed for: ${item.school}`);
                    handleUniversitySelect(item);
                  }}
                  activeOpacity={0.7}
                  delayPressIn={100}
                  delayPressOut={100}
                >
                  <View style={styles.suggestionContent}>
                    <Text style={styles.universityName} numberOfLines={1}>
                      {item.school}
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
                  {loading ? 'Loading universities...' : 'No universities found'}
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
    top: 45, // Just below the TextInput
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
    paddingRight: 8, // Make room for scroll indicator
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
  universityName: {
    color: '#FFFFFF',
    fontSize: 13,
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

export default UniversitySearchInput;