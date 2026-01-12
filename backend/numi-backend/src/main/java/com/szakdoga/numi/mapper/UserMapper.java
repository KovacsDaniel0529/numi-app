package com.szakdoga.numi.mapper;
import com.szakdoga.numi.dto.RegisterRequestDTO;
import com.szakdoga.numi.dto.UserResponseDTO;
import com.szakdoga.numi.model.AppUser;
import org.springframework.stereotype.Component;
@Component 
public class UserMapper {

    private final ProfileMapper profileMapper;

    public UserMapper(ProfileMapper profileMapper) {
        this.profileMapper = profileMapper;
    }
    // 1. A bejövő DTO-ból csinál Entity-t (hogy el tudjuk menteni)
    public AppUser toEntity(RegisterRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        AppUser user = new AppUser();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        // A dátumokat nem kell beállítani, azt a BaseEntity intézi!
        return user;
    }

    // 2. Az Entity-ből csinál biztonságos DTO-t (amit visszaküldünk)
    public UserResponseDTO toDto(AppUser user) {
        if (user == null) {
            return null;
        }
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setCreatedAt(user.getCreatedAt()); // Itt olvassuk ki a létrehozás idejét


        // Itt használjuk a ProfileMappert!
        // Ha van profilja, átalakítjuk DTO-vá. Ha nincs, null marad.
        if (user.getProfileDetail() != null) {
            dto.setProfileDetail(profileMapper.toDto(user.getProfileDetail()));
        }
        return dto;
    }
}
