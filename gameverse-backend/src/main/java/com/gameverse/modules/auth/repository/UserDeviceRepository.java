package com.gameverse.modules.auth.repository;

import com.gameverse.modules.auth.entity.UserDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserDeviceRepository extends JpaRepository<UserDevice, String> {
    List<UserDevice> findByUser_UserIdAndIsActiveTrue(String userId);
}
